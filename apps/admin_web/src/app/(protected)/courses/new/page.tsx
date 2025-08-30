"use client"

import type React from "react"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/http"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const difficultyOptions = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
]

export default function NewCoursePage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [instructorId, setInstructorId] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [published, setPublished] = useState(false)

  const createCourseMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (payload: any) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      apiFetch<any>("/v1/courses", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      }),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      const id = created?.id
      router.push(`/courses/${id}`)
    },
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      title,
      description,
      instructor_id: instructorId || undefined,
      difficulty_level: difficulty || undefined,
      is_published: published,
    }
    createCourseMutation.mutate(payload)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Create Course</h2>
      <form onSubmit={onSubmit} className="rounded-md border p-4 space-y-4 bg-background">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructor">Instructor ID</Label>
            <Input id="instructor" value={instructorId} onChange={(e) => setInstructorId(e.target.value)} />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficultyOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="published" checked={published} onCheckedChange={setPublished} />
            <Label htmlFor="published">Published</Label>
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={createCourseMutation.isPending}>
            {createCourseMutation.isPending ? "Creating…" : "Create"}
          </Button>
        </div>
      </form>
    </div>
  )
}
