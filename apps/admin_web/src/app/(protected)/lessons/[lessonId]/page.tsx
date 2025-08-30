"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { api } from "@/lib/client-api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Lesson = { id: number; title: string; [k: string]: any };

export default function LessonEditorPage({
  params,
}: {
  params: { lessonId: string };
}) {
  const lessonIdNum = Number(params.lessonId);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey = ["lesson", lessonIdNum];

  const {
    data: lesson,
    error,
    isLoading,
  } = useQuery<Lesson>({
    queryKey,
    queryFn: () => api<Lesson>(`/api/v1/lessons/${lessonIdNum}`),
    enabled: isFinite(lessonIdNum),
  });
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(lesson?.title || "");
  }, [lesson?.title]);

  const updateLessonMutation = useMutation({
    mutationFn: (updatedLesson: { title: string }) =>
      api(`/api/v1/lessons/${lessonIdNum}`, {
        method: "PUT",
        body: updatedLesson,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      toast({ description: "Lesson saved" });
    },
    onError: (e) => {
      toast({
        variant: "destructive",
        description: e.message || "Save failed",
      });
    },
  });

  function onSave() {
    if (!title.trim()) return;
    updateLessonMutation.mutate({ title: title.trim() });
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <h1 className="text-xl font-semibold">Lesson Editor</h1>
          <p className="text-sm text-muted-foreground">
            Lesson ID {lessonIdNum}
          </p>
        </header>

        <Card className="p-4 bg-card text-card-foreground">
          {isLoading ? (
            <div className="h-24 rounded-md bg-muted animate-pulse" />
          ) : error ? (
            <p className="text-sm text-red-400">Failed to load lesson.</p>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Lesson title"
                />
              </div>
              <Button
                onClick={onSave}
                disabled={!title.trim() || updateLessonMutation.isPending}
              >
                {updateLessonMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
