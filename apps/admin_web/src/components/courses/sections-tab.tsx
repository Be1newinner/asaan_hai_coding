"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { api } from "@/lib/client-api";
import { cn } from "@/lib/utils";

type Section = {
  id: string | number;
  course_id: string;
  title: string;
  order?: number;
};

export function SectionsTab({
  courseId,
  className,
}: {
  courseId: string;
  className?: string;
}) {
  const queryClient = useQueryClient();
  const queryKey = ["sections", { courseId }];

  const { data, error, isLoading } = useQuery<{
    items?: Section[];
    data?: Section[];
  }>({
    queryKey: queryKey,
    queryFn: () => api(`/api/v1/sections?course_id=${courseId}`),
  });

  const sections: Section[] = useMemo(() => {
    const arr = (data?.items || data?.data || []) as Section[];
    return [...arr].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [data]);

  const [newTitle, setNewTitle] = useState("");
  const [newOrder, setNewOrder] = useState<number | "">("");
  const [bulkText, setBulkText] = useState("");
  const [renamingId, setRenamingId] = useState<string | number | null>(null);
  const [renameText, setRenameText] = useState("");

  const createMutation = useMutation({
    mutationFn: (body: Partial<Section>) =>
      api("/api/v1/sections", { method: "POST", body }),
    onSuccess: () => {
      setNewTitle("");
      setNewOrder("");
      return queryClient.invalidateQueries({ queryKey });
    },
  });

  const bulkAddMutation = useMutation({
    mutationFn: (items: Omit<Section, "id">[]) =>
      api("/api/v1/sections/bulk", { method: "POST", body: items }),
    onSuccess: () => {
      setBulkText("");
      return queryClient.invalidateQueries({ queryKey });
    },
  });

  const renameMutation = useMutation({
    mutationFn: ({ id, title }: { id: string | number; title: string }) =>
      api(`/api/v1/sections/${id}`, { method: "PUT", body: { title } }),
    onSuccess: () => {
      setRenamingId(null);
      setRenameText("");
      return queryClient.invalidateQueries({ queryKey });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string | number) =>
      api(`/api/v1/sections/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

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
    }) => {
      return Promise.all([
        api(`/api/v1/sections/${a.id}`, {
          method: "PUT",
          body: { order: bOrder },
        }),
        api(`/api/v1/sections/${b.id}`, {
          method: "PUT",
          body: { order: aOrder },
        }),
      ]);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const anyMutationPending =
    createMutation.isPending ||
    bulkAddMutation.isPending ||
    renameMutation.isPending ||
    removeMutation.isPending ||
    moveMutation.isPending;

  function move(id: string | number, direction: "up" | "down") {
    const idx = sections.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const swapWith = direction === "up" ? idx - 1 : idx + 1;
    if (swapWith < 0 || swapWith >= sections.length) return;
    const a = sections[idx];
    const b = sections[swapWith];
    const aOrder = a.order ?? idx;
    const bOrder = b.order ?? swapWith;
    moveMutation.mutate({ a, b, aOrder, bOrder });
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm text-muted-foreground mb-1">
            New section title
          </label>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g., Introduction"
          />
        </div>
        <div className="w-32">
          <label className="block text-sm text-muted-foreground mb-1">
            Order (optional)
          </label>
          <Input
            inputMode="numeric"
            value={newOrder}
            onChange={(e) =>
              setNewOrder(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="0"
          />
        </div>
        <Button
          onClick={() => {
            if (!newTitle.trim()) return;
            const body: Partial<Section> = {
              course_id: courseId,
              title: newTitle.trim(),
            };
            if (newOrder !== "") body.order = Number(newOrder);
            createMutation.mutate(body);
          }}
          className="md:self-end"
          disabled={anyMutationPending}
        >
          Add section
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="md:ml-auto">
              Bulk add
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Bulk add sections</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                One title per line. Order will follow the list.
              </p>
              <textarea
                className="w-full min-h-40 rounded-md bg-card text-card-foreground p-3 ring-1 ring-border outline-none"
                placeholder={"Section A\nSection B\nSection C"}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    const lines = bulkText
                      .split("\n")
                      .map((l) => l.trim())
                      .filter(Boolean);
                    if (lines.length === 0) return;
                    const items = lines.map((title, idx) => ({
                      course_id: courseId,
                      title,
                      order: idx,
                    }));
                    bulkAddMutation.mutate(items);
                  }}
                  disabled={anyMutationPending}
                >
                  Add
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {isLoading ? (
          <Card>
            <CardContent className="p-6 text-muted-foreground">
              Loading sections…
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-6 text-destructive">
              Failed to load sections
            </CardContent>
          </Card>
        ) : sections.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-muted-foreground">
              No sections yet.
            </CardContent>
          </Card>
        ) : (
          sections.map((s) => (
            <Card key={String(s.id)} className="border-border">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-pretty">
                  {renamingId === s.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={renameText}
                        onChange={(e) => setRenameText(e.target.value)}
                        className="max-w-xs"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          if (!renameText.trim()) return;
                          renameMutation.mutate({
                            id: s.id,
                            title: renameText.trim(),
                          });
                        }}
                        disabled={anyMutationPending}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setRenamingId(null);
                          setRenameText("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <span>{s.title}</span>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    aria-label="Move up"
                    onClick={() => move(s.id, "up")}
                    disabled={anyMutationPending}
                  >
                    ↑
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    aria-label="Move down"
                    onClick={() => move(s.id, "down")}
                    disabled={anyMutationPending}
                  >
                    ↓
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  Order: {s.order ?? 0}
                </div>
                <div className="flex items-center gap-2">
                  {renamingId !== s.id && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setRenamingId(s.id);
                        setRenameText(s.title);
                      }}
                    >
                      Rename
                    </Button>
                  )}
                  <Link
                    href={`/courses/${courseId}/sections/${s.id}`}
                    className="underline text-sm"
                  >
                    Manage lessons
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={anyMutationPending}
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete section “{s.title}”?
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <p className="text-sm text-muted-foreground">
                        This action cannot be undone.
                      </p>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => removeMutation.mutate(s.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
