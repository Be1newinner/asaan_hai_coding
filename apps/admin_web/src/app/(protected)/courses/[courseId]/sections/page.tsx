"use client";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "@/lib/client-api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

type Section = {
  id: number;
  title: string;
  order?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

function useSections(courseId: string) {
  const queryKey = ["sections", { courseId }];
  const { data, error, isLoading } = useQuery<Section[]>({
    queryKey,
    queryFn: () => api<Section[]>(`/api/v1/sections?course_id=${courseId}`),
    enabled: !!courseId,
  });
  return { sections: data ?? [], error, isLoading, queryKey };
}

export default function CourseSectionsPage({
  params,
}: {
  params: { courseId: string };
}) {
  const courseId = params.courseId;
  const { toast } = useToast();
  const { sections, isLoading, error, queryKey } = useSections(courseId);
  const queryClient = useQueryClient();

  const ordered = useMemo(() => {
    return [...sections].sort((a, b) => {
      const ao = typeof a.order === "number" ? a.order! : 0;
      const bo = typeof b.order === "number" ? b.order! : 0;
      return ao - bo || a.id - b.id;
    });
  }, [sections]);

  const [creatingTitle, setCreatingTitle] = useState("");
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");

  const createMutation = useMutation({
    mutationFn: (title: string) =>
      api<Section>("/api/v1/sections", {
        method: "POST",
        body: { course_id: courseId, title: title.trim() },
      }),
    onSuccess: () => {
      setCreatingTitle("");
      queryClient.invalidateQueries({ queryKey });
      toast({ description: "Section created" });
    },
    onError: (e) =>
      toast({
        variant: "destructive",
        description: e.message || "Failed to create section",
      }),
  });

  function onCreate() {
    if (!creatingTitle.trim()) return;
    createMutation.mutate(creatingTitle);
  }

  const bulkCreateMutation = useMutation({
    mutationFn: (items: Omit<Section, "id">[]) =>
      api<Section[]>("/api/v1/sections/bulk", {
        method: "POST",
        body: items,
      }),
    onSuccess: () => {
      setBulkText("");
      setBulkOpen(false);
      queryClient.invalidateQueries({ queryKey });
      toast({ description: "Sections added" });
    },
    onError: (e) =>
      toast({
        variant: "destructive",
        description: e.message || "Bulk create failed",
      }),
  });

  function onBulkCreate() {
    const items = bulkText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((title, idx) => ({
        course_id: courseId,
        title,
        order: (sections?.length || 0) + idx,
      }));

    if (!items.length) return toast({ description: "No titles provided" });
    bulkCreateMutation.mutate(items);
  }

  const moveMutation = useMutation({
    mutationFn: ({
      a,
      b,
      aOrder,
      bOrder,
    }: {
      a: Section;
      b: Section;
      aOrder: number;
      bOrder: number;
    }) =>
      Promise.all([
        api(`/api/v1/sections/${a.id}`, {
          method: "PUT",
          body: { order: bOrder },
        }),
        api(`/api/v1/sections/${b.id}`, {
          method: "PUT",
          body: { order: aOrder },
        }),
      ]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (e) =>
      toast({
        variant: "destructive",
        description: e.message || "Reorder failed",
      }),
  });

  function onMove(id: number, direction: "up" | "down") {
    const idx = ordered.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= ordered.length) return;
    const a = ordered[idx];
    const b = ordered[targetIdx];
    const aOrder = typeof a.order === "number" ? a.order! : idx;
    const bOrder = typeof b.order === "number" ? b.order! : targetIdx;
    moveMutation.mutate({ a, b, aOrder, bOrder });
  }

  const anyMutationPending =
    createMutation.isPending ||
    bulkCreateMutation.isPending ||
    moveMutation.isPending;

  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-pretty">Sections</h1>
            <p className="text-sm text-muted-foreground">Course: {courseId}</p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="New section title"
              value={creatingTitle}
              onChange={(e) => setCreatingTitle(e.target.value)}
              className="w-56"
            />
            <Button
              onClick={onCreate}
              disabled={anyMutationPending || !creatingTitle.trim()}
            >
              Add
            </Button>
            <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary">Bulk add</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk add sections</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Paste one title per line. They will be added in order.
                  </p>
                  <textarea
                    className="w-full h-40 rounded-md border bg-background p-2 text-sm"
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder="Introduction&#10;Basics&#10;Advanced Topics"
                  />
                </div>
                <DialogFooter>
                  <Button onClick={onBulkCreate} disabled={anyMutationPending}>
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <Card className="p-4">
            <p className="text-sm text-red-400">Failed to load sections.</p>
          </Card>
        ) : ordered.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No sections yet. Create one to get started.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ordered.map((s) => (
              <SectionCard
                key={s.id}
                section={s}
                courseId={courseId}
                onMove={onMove}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function SectionCard({
  section,
  courseId,
  onMove,
}: {
  section: Section;
  courseId: string;
  onMove: (id: number, direction: "up" | "down") => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(section.title || "");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const renameMutation = useMutation({
    mutationFn: (newTitle: string) =>
      api<Section>(`/api/v1/sections/${section.id}`, {
        method: "PUT",
        body: { title: newTitle.trim() },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections", { courseId }] });
      toast({ description: "Section updated" });
    },
    onError: (e) =>
      toast({
        variant: "destructive",
        description: e.message || "Update failed",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      api<void>(`/api/v1/sections/${section.id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections", { courseId }] });
      toast({ description: "Section deleted" });
      setConfirmOpen(false);
    },
    onError: (e) =>
      toast({
        variant: "destructive",
        description: e.message || "Delete failed",
      }),
  });

  const isMutating = renameMutation.isPending || deleteMutation.isPending;

  return (
    <Card className="p-4 bg-card text-card-foreground">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">
            Order {section.order ?? "-"}
          </div>
          <div className="mt-1 font-medium">{section.title || "Untitled"}</div>
        </div>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={() => onMove(section.id, "up")}
            aria-label="Move up"
            disabled={isMutating}
          >
            ↑
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={() => onMove(section.id, "down")}
            aria-label="Move down"
            disabled={isMutating}
          >
            ↓
          </Button>
          <Link href={`/courses/${courseId}/sections/${section.id}`}>
            <Button>Lessons</Button>
          </Link>
          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isMutating}>
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete section</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove the section and may orphan
                  lessons.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteMutation.mutate()}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Rename section"
        />
        <Button
          onClick={() => renameMutation.mutate(title)}
          disabled={!title.trim() || renameMutation.isPending}
        >
          {renameMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </Card>
  );
}
