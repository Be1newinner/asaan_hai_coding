"use client";
import { useEffect, useMemo, useState } from "react";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Section = { id: number; title: string; order?: number; [k: string]: any };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Lesson = { id: number; title: string; order?: number; [k: string]: any };

export default function SectionLessonsPage({
  params,
}: {
  params: { courseId: string; sectionId: string };
}) {
  const courseId = params.courseId;
  const sectionIdNum = Number(params.sectionId);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sectionQueryKey = ["section", sectionIdNum];
  const { data: section } = useQuery<Section>({
    queryKey: sectionQueryKey,
    queryFn: () => api<Section>(`/api/v1/sections/${sectionIdNum}`),
    enabled: isFinite(sectionIdNum),
  });

  const lessonsQueryKey = ["lessons", { sectionId: sectionIdNum }];
  const {
    data: lessons = [],
    error,
    isLoading,
  } = useQuery<Lesson[]>({
    queryKey: lessonsQueryKey,
    queryFn: () => api<Lesson[]>(`/api/v1/lessons?section_id=${sectionIdNum}`),
    enabled: isFinite(sectionIdNum),
  });

  const ordered = useMemo(
    () =>
      [...lessons].sort((a, b) => {
        const ao = typeof a.order === "number" ? a.order! : 0;
        const bo = typeof b.order === "number" ? b.order! : 0;
        return ao - bo || a.id - b.id;
      }),
    [lessons]
  );

  const [newTitle, setNewTitle] = useState("");
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");

  const createLessonMutation = useMutation({
    mutationFn: (title: string) =>
      api<Lesson>("/api/v1/lessons", {
        method: "POST",
        body: { section_id: sectionIdNum, title: title.trim() },
      }),
    onSuccess: () => {
      setNewTitle("");
      queryClient.invalidateQueries({ queryKey: lessonsQueryKey });
      toast({ description: "Lesson created" });
    },
    onError: (e: Error) => {
      toast({
        variant: "destructive",
        description: e.message || "Create failed",
      });
    },
  });

  const bulkCreateLessonsMutation = useMutation({
    mutationFn: (
      items: { section_id: number; title: string; order: number }[]
    ) =>
      api<Lesson[]>("/api/v1/lessons/bulk", {
        method: "POST",
        body: items,
      }),
    onSuccess: () => {
      setBulkText("");
      setBulkOpen(false);
      queryClient.invalidateQueries({ queryKey: lessonsQueryKey });
      toast({ description: "Lessons added" });
    },
    onError: (e: Error) => {
      toast({
        variant: "destructive",
        description: e.message || "Bulk create failed",
      });
    },
  });

  function onBulkCreateLessons() {
    const items = bulkText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((title, idx) => ({
        section_id: sectionIdNum,
        title,
        order: (lessons?.length || 0) + idx,
      }));

    if (!items.length) return toast({ description: "No titles provided" });
    bulkCreateLessonsMutation.mutate(items);
  }

  const moveLessonMutation = useMutation({
    mutationFn: ({
      a,
      b,
      aOrder,
      bOrder,
    }: {
      a: Lesson;
      b: Lesson;
      aOrder: number;
      bOrder: number;
    }) =>
      Promise.all([
        api(`/api/v1/lessons/${a.id}`, {
          method: "PUT",
          body: { order: bOrder },
        }),
        api(`/api/v1/lessons/${b.id}`, {
          method: "PUT",
          body: { order: aOrder },
        }),
      ]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonsQueryKey });
      toast({ description: "Order updated" });
    },
    onError: (e: Error) => {
      toast({
        variant: "destructive",
        description: e.message || "Reorder failed",
      });
    },
  });

  function onMoveLesson(id: number, direction: "up" | "down") {
    const idx = ordered.findIndex((l) => l.id === id);
    if (idx < 0) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= ordered.length) return;
    const a = ordered[idx];
    const b = ordered[targetIdx];
    const aOrder = typeof a.order === "number" ? a.order! : idx;
    const bOrder = typeof b.order === "number" ? b.order! : targetIdx;
    moveLessonMutation.mutate({ a, b, aOrder, bOrder });
  }

  const isMutating =
    createLessonMutation.isPending ||
    bulkCreateLessonsMutation.isPending ||
    moveLessonMutation.isPending;

  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-pretty">Section</h1>
            <p className="text-sm text-muted-foreground">
              Course {courseId} • Section ID {sectionIdNum}
            </p>
          </div>
          <Link href={`/courses/${courseId}/sections`}>
            <Button variant="secondary">Back to sections</Button>
          </Link>
        </header>

        <RenameSectionCard
          section={section}
          sectionIdNum={sectionIdNum}
          queryClient={queryClient}
          sectionQueryKey={sectionQueryKey}
        />

        <Card className="p-4 bg-card text-card-foreground">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium">Lessons</h2>
            <div className="flex items-center gap-2">
              <Input
                placeholder="New lesson title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-64"
              />
              <Button
                onClick={() => createLessonMutation.mutate(newTitle)}
                disabled={!newTitle.trim() || isMutating}
              >
                Add
              </Button>
              <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary">Bulk add</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bulk add lessons</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Paste one title per line. They will be added in order.
                    </p>
                    <textarea
                      className="w-full h-40 rounded-md border bg-background p-2 text-sm"
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                      placeholder="Lesson 1&#10;Lesson 2&#10;Lesson 3"
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={onBulkCreateLessons} disabled={isMutating}>
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 rounded-md bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <p className="text-sm text-red-400">Failed to load lessons.</p>
          ) : ordered.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No lessons yet. Create one to get started.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {ordered.map((l) => (
                <LessonRow
                  key={l.id}
                  lesson={l}
                  courseId={courseId}
                  onMoveLesson={onMoveLesson}
                  isMoving={moveLessonMutation.isPending}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}

function RenameSectionCard({
  section,
  sectionIdNum,
  queryClient,
  sectionQueryKey,
}: {
  section: Section | undefined;
  sectionIdNum: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryClient: any;
  sectionQueryKey: (string | number)[];
}) {
  const { toast } = useToast();
  const [rename, setRename] = useState("");

  useEffect(() => {
    if (section) {
      setRename(section.title || "");
    }
  }, [section]);

  const renameSectionMutation = useMutation({
    mutationFn: (newTitle: string) =>
      api<Section>(`/api/v1/sections/${sectionIdNum}`, {
        method: "PUT",
        body: { title: newTitle.trim() },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sectionQueryKey });
      toast({ description: "Section renamed" });
    },
    onError: (e: Error) => {
      toast({
        variant: "destructive",
        description: e.message || "Rename failed",
      });
    },
  });

  return (
    <Card className="p-4 bg-card text-card-foreground">
      <h2 className="font-medium mb-3">Rename section</h2>
      <div className="flex gap-2">
        <Input
          value={rename}
          onChange={(e) => setRename(e.target.value)}
          placeholder="Section title"
          disabled={renameSectionMutation.isPending}
        />
        <Button
          onClick={() => renameSectionMutation.mutate(rename)}
          disabled={!rename.trim() || renameSectionMutation.isPending}
        >
          {renameSectionMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </Card>
  );
}

function LessonRow({
  lesson,
  courseId,
  onMoveLesson,
  isMoving,
}: {
  lesson: Lesson;
  courseId: string;
  onMoveLesson: (id: number, direction: "up" | "down") => void;
  isMoving: boolean;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteLessonMutation = useMutation({
    mutationFn: (id: number) =>
      api<void>(`/api/v1/lessons/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      toast({ description: "Lesson deleted" });
    },
    onError: (e: Error) => {
      toast({
        variant: "destructive",
        description: e.message || "Delete failed",
      });
    },
  });

  return (
    <div className="py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-10 text-center">
          {lesson.order ?? "-"}
        </span>
        <span className="font-medium">{lesson.title || "Untitled"}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="secondary"
          onClick={() => onMoveLesson(lesson.id, "up")}
          disabled={isMoving || deleteLessonMutation.isPending}
        >
          ↑
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={() => onMoveLesson(lesson.id, "down")}
          disabled={isMoving || deleteLessonMutation.isPending}
        >
          ↓
        </Button>
        <Link href={`/lessons/${lesson.id}`}>
          <Button disabled={isMoving || deleteLessonMutation.isPending}>
            Open
          </Button>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              disabled={isMoving || deleteLessonMutation.isPending}
            >
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete lesson</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteLessonMutation.mutate(lesson.id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
