"use client";

import type React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/http";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SectionsTab } from "@/components/courses/sections-tab";

type CourseRead = {
  id: string;
  title: string;
  description?: string;
  instructor_id?: string;
  difficulty_level?: string;
  is_published?: boolean;
};

export default function CourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const search = useSearchParams();
  const [tab, setTab] = useState(search.get("tab") || "overview");
  const queryClient = useQueryClient();
  const queryKey = ["course", params.courseId];

  const { data: course, isLoading } = useQuery<CourseRead>({
    queryKey,
    queryFn: () => apiFetch<CourseRead>(`/api/v1/courses/${params.courseId}`),
    enabled: !!params.courseId,
  });

  const updateCourseMutation = useMutation({
    mutationFn: (updatedCourse: Partial<CourseRead>) =>
      apiFetch(`/api/v1/courses/${course!.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...course, ...updatedCourse }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const togglePublish = (checked: boolean) => {
    if (!course) return;
    updateCourseMutation.mutate({ is_published: checked });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{course?.title || "Course"}</h2>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="rounded-md border p-4 bg-background">
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading…</div>
            ) : course ? (
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Title:</span>{" "}
                  <span className="font-medium">{course.title}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Description:
                  </span>{" "}
                  <span>{course.description || "—"}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Instructor:
                  </span>{" "}
                  <span>{course.instructor_id || "—"}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Difficulty:
                  </span>{" "}
                  <span className="capitalize">
                    {course.difficulty_level || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="publish"
                    checked={!!course.is_published}
                    onCheckedChange={togglePublish}
                  />
                  <label htmlFor="publish" className="text-sm">
                    Published
                  </label>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Not found</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sections" className="space-y-4">
          <div className="rounded-md border p-4 bg-background">
            <SectionsTab courseId={params.courseId} />
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <CourseSettingsForm
            course={course}
            onSaved={() => queryClient.invalidateQueries({ queryKey })}
            disabled={isLoading || !course}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CourseSettingsForm({
  course,
  onSaved,
  disabled,
}: {
  course?: CourseRead;
  onSaved: () => void;
  disabled?: boolean;
}) {
  const [title, setTitle] = useState(course?.title || "");
  const [description, setDescription] = useState(course?.description || "");
  const [instructorId, setInstructorId] = useState(course?.instructor_id || "");
  const [difficulty, setDifficulty] = useState(course?.difficulty_level || "");

  useEffect(() => {
    if (course) {
      setTitle(course.title || "");
      setDescription(course.description || "");
      setInstructorId(course.instructor_id || "");
      setDifficulty(course.difficulty_level || "");
    }
  }, [course]);

  const updateCourseMutation = useMutation({
    mutationFn: (payload: Partial<CourseRead>) =>
      apiFetch(`/api/v1/courses/${course!.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      onSaved();
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;
    const payload = {
      title,
      description,
      instructor_id: instructorId || undefined,
      difficulty_level: difficulty || undefined,
    };
    updateCourseMutation.mutate(payload);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-md border p-4 space-y-4 bg-background opacity-100"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="instructor">Instructor ID</Label>
          <Input
            id="instructor"
            value={instructorId}
            onChange={(e) => setInstructorId(e.target.value)}
            disabled={disabled}
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Input
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={disabled}
            placeholder="beginner|intermediate|advanced"
          />
        </div>
      </div>
      <Button type="submit" disabled={disabled || updateCourseMutation.isPending}>
        {updateCourseMutation.isPending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
