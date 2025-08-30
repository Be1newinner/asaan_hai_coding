"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/http";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type CourseReadBase = {
  id: string;
  title: string;
  description?: string;
  instructor_id?: string;
  difficulty_level?: string;
  is_published?: boolean;
  updated_at?: string;
  instructor_name?: string;
};

const PAGE_SIZE = 20;

const difficultyOptions = [
  { label: "All", value: "all" },
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

const publishedOptions = [
  { label: "All", value: "all" },
  { label: "Published", value: "true" },
  { label: "Unpublished", value: "false" },
];

export default function CoursesPage() {
  const params = useSearchParams();
  const router = useRouter();

  const [titleFilter, setTitleFilter] = useState(params.get("q") ?? "");
  const [difficulty, setDifficulty] = useState(
    (params.get("difficulty") === "all" ? "" : params.get("difficulty")) ?? ""
  );
  const [published, setPublished] = useState(
    (params.get("published") === "all" ? "" : params.get("published")) ?? ""
  );
  const page = Number(params.get("page") ?? "1");
  const skip = (page - 1) * PAGE_SIZE;

  const queryString = useMemo(() => {
    const q = new URLSearchParams();
    q.set("skip", String(skip));
    q.set("limit", String(PAGE_SIZE));
    if (titleFilter) q.set("q", titleFilter);
    if (difficulty) q.set("difficulty", difficulty);
    if (published) q.set("published", published);
    return q.toString();
  }, [skip, titleFilter, difficulty, published]);

  const queryKey = ["courses", queryString];
  const { data, isLoading } = useQuery<CourseReadBase[]>({
    queryKey,
    queryFn: () => apiFetch<CourseReadBase[]>(`/v1/courses?${queryString}`),
  });
  const queryClient = useQueryClient();

  const items = data ?? [];

  const onApplyFilters = () => {
    const q = new URLSearchParams();
    if (titleFilter) q.set("q", titleFilter);
    if (difficulty) q.set("difficulty", difficulty);
    if (published) q.set("published", published);
    q.set("page", String(page));
    router.push(`/courses?${q.toString()}`);
  };

  const onClearFilters = () => {
    setTitleFilter("");
    setDifficulty("");
    setPublished("");
    router.push("/courses");
  };

  const goToPage = (nextPage: number) => {
    const q = new URLSearchParams();
    if (titleFilter) q.set("q", titleFilter);
    if (difficulty) q.set("difficulty", difficulty);
    if (published) q.set("published", published);
    q.set("page", String(nextPage));
    router.push(`/courses?${q.toString()}`);
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/v1/courses/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  const onDelete = (id: string) => {
    if (!confirm("Delete this course?")) return;
    deleteMutation.mutate(id);
  };

  const bulkCreateMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (payload: any[]) =>
      apiFetch(`/v1/courses/bulk`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "content-type": "application/json" },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["courses"] }),
  });

  const onBulkCreate = () => {
    const payload = [
      {
        title: "Sample Course A",
        description: "Auto created",
        is_published: false,
      },
      {
        title: "Sample Course B",
        description: "Auto created",
        is_published: true,
      },
    ];
    bulkCreateMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Courses</h2>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onBulkCreate}>
            Bulk Create
          </Button>
          <Link href="/courses/new">
            <Button>Create</Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border p-4 bg-background">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search title…"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
            />
          </div>
          <Select
            value={difficulty}
            onValueChange={(v) => setDifficulty(v === "all" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficultyOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={published}
            onValueChange={(v) => setPublished(v === "all" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Published" />
            </SelectTrigger>
            <SelectContent>
              {publishedOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-3 flex gap-2">
          <Button size="sm" onClick={onApplyFilters}>
            Apply
          </Button>
          <Button size="sm" variant="outline" onClick={onClearFilters}>
            Clear
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {!isLoading && items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  No courses
                </TableCell>
              </TableRow>
            )}
            {items.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">
                  <Link href={`/courses/${c.id}`} className="hover:underline">
                    {c.title}
                  </Link>
                </TableCell>
                <TableCell className="capitalize">
                  {c.difficulty_level || "—"}
                </TableCell>
                <TableCell>
                  {c.instructor_name || c.instructor_id || "—"}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-md border",
                      c.is_published
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                        : "bg-amber-500/10 border-amber-500/40 text-amber-400"
                    )}
                  >
                    {c.is_published ? "Yes" : "No"}
                  </span>
                </TableCell>
                <TableCell>
                  {c.updated_at ? new Date(c.updated_at).toLocaleString() : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/courses/${c.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View
                    </Link>
                    <Link
                      href={`/courses/${c.id}?tab=settings`}
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      className="text-sm text-destructive hover:underline"
                      onClick={() => onDelete(c.id)}
                    >
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
        >
          Previous
        </Button>
        <div className="text-sm text-muted-foreground">Page {page}</div>
        <Button variant="outline" size="sm" onClick={() => goToPage(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
