"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  ArrowLeft,
  GripVertical,
  Video,
  FileText,
  HelpCircle,
  Clock,
  Users,
  BookOpen,
  DollarSign,
  Loader2,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { coursesService } from "@/lib/api/services/courses";
import type {
  Course,
  CourseCreate,
  CourseUpdate,
  Section,
  Lesson,
} from "@/lib/api/types";

type ViewType =
  | "list"
  | "course-detail"
  | "course-editor"
  | "section-detail"
  | "section-editor"
  | "lesson-detail"
  | "lesson-editor";

export default function CoursesList() {
  const [view, setView] = useState<ViewType>("list");
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCreating, setIsCreating] = useState(false);

  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await coursesService.listCourses({
        status: filterStatus !== "all" ? filterStatus : undefined,
      });
      setCourses(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleDeleteCourse = async (id: string) => {
    try {
      await coursesService.deleteCourse(id);
      await loadCourses();
      if (selectedCourse?.id === id) {
        setSelectedCourse(null);
        setView("list");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete course");
    }
  };

  const handleSaveCourse = async (
    data: CourseCreate | CourseUpdate,
    isNew: boolean
  ) => {
    if (isNew) {
      const newCourse = await coursesService.createCourse(data as CourseCreate);
      setSelectedCourse(newCourse);
    } else if (selectedCourse) {
      const updated = await coursesService.updateCourse(
        selectedCourse.id,
        data as CourseUpdate
      );
      setSelectedCourse(updated);
    }
    await loadCourses();
    setView("course-detail");
    setIsCreating(false);
  };

  const filteredCourses = courses
    .filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );

  // Course Editor View
  if (view === "course-editor") {
    return (
      <CourseEditor
        course={isCreating ? null : selectedCourse}
        onBack={() => {
          setView(selectedCourse ? "course-detail" : "list");
          setIsCreating(false);
        }}
        onSave={handleSaveCourse}
        isNew={isCreating}
      />
    );
  }

  // Course Detail View
  if (view === "course-detail" && selectedCourse) {
    return (
      <CourseDetail
        course={selectedCourse}
        onBack={() => {
          setView("list");
          setSelectedCourse(null);
        }}
        onEdit={() => setView("course-editor")}
        onDelete={() => handleDeleteCourse(selectedCourse.id)}
        onSelectSection={(section) => {
          setSelectedSection(section);
          setView("section-detail");
        }}
        onAddSection={() => {
          setSelectedSection(null);
          setView("section-editor");
        }}
        onEditSection={(section) => {
          setSelectedSection(section);
          setView("section-editor");
        }}
      />
    );
  }

  // Section Editor View
  if (view === "section-editor" && selectedCourse) {
    return (
      <SectionEditor
        section={selectedSection}
        courseId={selectedCourse.id}
        onBack={() => setView("course-detail")}
        onSave={async () => {
          // Refresh course data
          const updated = await coursesService.getCourse(selectedCourse.id);
          setSelectedCourse(updated);
          setView("course-detail");
        }}
        isNew={!selectedSection}
      />
    );
  }

  // Section Detail / Lessons List View
  if (view === "section-detail" && selectedSection && selectedCourse) {
    return (
      <SectionDetail
        section={selectedSection}
        courseId={selectedCourse.id}
        onBack={() => {
          setView("course-detail");
          setSelectedSection(null);
        }}
        onEditSection={() => setView("section-editor")}
        onSelectLesson={(lesson) => {
          setSelectedLesson(lesson);
          setView("lesson-detail");
        }}
        onAddLesson={() => {
          setSelectedLesson(null);
          setView("lesson-editor");
        }}
        onEditLesson={(lesson) => {
          setSelectedLesson(lesson);
          setView("lesson-editor");
        }}
      />
    );
  }

  if (view === "lesson-detail" && selectedLesson && selectedSection) {
    return (
      <LessonDetail
        lesson={selectedLesson}
        onBack={() => {
          setView("section-detail");
          setSelectedLesson(null);
        }}
        onEdit={() => setView("lesson-editor")}
      />
    );
  }

  // Lesson Editor View
  if (view === "lesson-editor" && selectedSection) {
    return (
      <LessonEditor
        lesson={selectedLesson}
        sectionId={selectedSection.id}
        onBack={() => setView("section-detail")}
        onSave={async () => {
          setView("section-detail");
        }}
        isNew={!selectedLesson}
      />
    );
  }

  // Courses List View
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Courses
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage your courses and curriculum
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedCourse(null);
            setIsCreating(true);
            setView("course-editor");
          }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          <Plus size={18} />
          New Course
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-3 text-muted-foreground"
            size={18}
          />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm"
        >
          <option value="all">All Courses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No courses found
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "Try adjusting your search"
              : "Create your first course to get started"}
          </p>
          {!searchQuery && (
            <Button
              onClick={() => {
                setIsCreating(true);
                setView("course-editor");
              }}
            >
              <Plus size={18} /> Create Course
            </Button>
          )}
        </div>
      )}

      {/* Courses Grid */}
      {!loading && filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onView={() => {
                setSelectedCourse(course);
                setView("course-detail");
              }}
              onEdit={() => {
                setSelectedCourse(course);
                setView("course-editor");
              }}
              onDelete={() => handleDeleteCourse(course.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseCard({
  course,
  onView,
  onEdit,
  onDelete,
}: {
  course: Course;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Card className="border-border bg-card hover:bg-accent/50 transition-colors">
      <CardContent className="p-4 space-y-4">
        {/* Thumbnail */}
        <div
          className="w-full h-32 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={onView}
        >
          {course.thumbnail ? (
            <img
              src={course.thumbnail || "/placeholder.svg"}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <BookOpen className="w-12 h-12 text-muted-foreground" />
          )}
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-foreground line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                onClick={onView}
              >
                {course.title}
              </h3>
              <p className="text-sm font-bold text-purple-500 mt-1">
                {course.price === 0 ? "Free" : `$${course.price}`}
              </p>
            </div>
            <div className="relative">
              <button
                className="p-1 hover:bg-muted rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
              >
                <MoreVertical size={16} className="text-muted-foreground" />
              </button>
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-8 z-20 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[140px]">
                    <button
                      onClick={() => {
                        onEdit();
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        onView();
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
                    >
                      <Eye size={14} /> View
                    </button>
                    <hr className="my-1 border-border" />
                    <button
                      onClick={() => {
                        onDelete();
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-destructive/10 text-destructive flex items-center gap-2"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`text-xs px-2 py-1 rounded-full inline-block ${
              course.status === "published"
                ? "bg-green-500/20 text-green-500"
                : course.status === "hidden"
                  ? "bg-orange-500/20 text-orange-500"
                  : "bg-yellow-500/20 text-yellow-500"
            }`}
          >
            {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
          </span>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Sections</p>
              <p className="text-sm font-semibold text-foreground">
                {course.sections_count}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Lessons</p>
              <p className="text-sm font-semibold text-foreground">
                {course.lessons_count}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Students</p>
              <p className="text-sm font-semibold text-foreground">
                {course.students_count}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground font-semibold">
                {course.progress}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CourseEditor({
  course,
  onBack,
  onSave,
  isNew,
}: {
  course: Course | null;
  onBack: () => void;
  onSave: (data: CourseCreate | CourseUpdate, isNew: boolean) => Promise<void>;
  isNew: boolean;
}) {
  const [title, setTitle] = useState(course?.title || "");
  const [slug, setSlug] = useState(course?.slug || "");
  const [description, setDescription] = useState(course?.description || "");
  const [price, setPrice] = useState(course?.price?.toString() || "0");
  const [status, setStatus] = useState<"draft" | "published" | "hidden">(
    course?.status || "draft"
  );
  const [thumbnail, setThumbnail] = useState(course?.thumbnail || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSlug, setAutoSlug] = useState(isNew);

  useEffect(() => {
    if (autoSlug && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  }, [title, autoSlug]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!slug.trim()) {
      setError("URL slug is required");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave(
        {
          title: title.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
          thumbnail: thumbnail.trim() || null,
          price: Number.parseFloat(price) || 0,
          status,
        },
        isNew
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save course");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <button
        onClick={onBack}
        className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {isNew ? "Create Course" : "Edit Course"}
        </h1>
        <p className="text-muted-foreground">
          {isNew ? "Set up your new course" : "Update course details"}
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-border bg-card lg:col-span-2">
          <CardContent className="p-4 md:p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Course title"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                URL Slug <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-2">
                <Input
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setAutoSlug(false);
                  }}
                  className="font-mono"
                />
                {!autoSlug && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAutoSlug(true)}
                  >
                    Auto
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Thumbnail URL
              </label>
              <Input
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://..."
              />
              {thumbnail && (
                <div className="mt-2 w-full h-32 rounded-lg bg-muted overflow-hidden">
                  <img
                    src={thumbnail || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-32 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Course description..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Pricing</h3>
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-muted-foreground" />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Set to 0 for a free course
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Status</h3>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="hidden">Hidden</option>
              </select>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-4 md:p-6 space-y-3">
              <Button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isNew ? "Create Course" : "Save Changes"}
              </Button>
              <Button onClick={onBack} variant="ghost" className="w-full">
                Discard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CourseDetail({
  course,
  onBack,
  onEdit,
  onDelete,
  onSelectSection,
  onAddSection,
  onEditSection,
}: {
  course: Course;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSelectSection: (section: Section) => void;
  onAddSection: () => void;
  onEditSection: (section: Section) => void;
}) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const loadSections = async () => {
      try {
        setLoading(true);
        const data = await coursesService.listSections(course.id);
        setSections(data);
      } catch (err) {
        console.error("Failed to load sections:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSections();
  }, [course.id]);

  const handleDeleteSection = async (sectionId: string) => {
    try {
      await coursesService.deleteSection(sectionId);
      setSections(sections.filter((s) => s.id !== sectionId));
    } catch (err) {
      console.error("Failed to delete section:", err);
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <button
        onClick={onBack}
        className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
      >
        <ArrowLeft size={16} /> Back to Courses
      </button>

      {/* Hero */}
      <div className="space-y-4">
        <div className="w-full h-48 md:h-64 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center overflow-hidden">
          {course.thumbnail ? (
            <img
              src={course.thumbnail || "/placeholder.svg"}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <BookOpen className="w-16 h-16 text-muted-foreground" />
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {course.title}
            </h1>
            <p className="text-lg font-semibold text-purple-500">
              {course.price === 0 ? "Free" : `$${course.price}`}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  course.status === "published"
                    ? "bg-green-500/20 text-green-500"
                    : course.status === "hidden"
                      ? "bg-orange-500/20 text-orange-500"
                      : "bg-yellow-500/20 text-yellow-500"
                }`}
              >
                {course.status.toUpperCase()}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Users size={14} /> {course.students_count} students
              </span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={onEdit}>
              <Pencil size={16} /> Edit Course
            </Button>
            <Button onClick={onAddSection}>
              <Plus size={16} /> Add Section
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <BookOpen className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {sections.length}
            </p>
            <p className="text-xs text-muted-foreground">Sections</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <FileText className="w-6 h-6 text-pink-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {course.lessons_count}
            </p>
            <p className="text-xs text-muted-foreground">Lessons</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {course.students_count}
            </p>
            <p className="text-xs text-muted-foreground">Students</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {course.progress}%
            </p>
            <p className="text-xs text-muted-foreground">Complete</p>
          </CardContent>
        </Card>
      </div>

      {/* Sections */}
      <Card className="border-border bg-card">
        <CardContent className="p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Sections ({sections.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : sections.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No sections yet. Add your first section to start building your
                course.
              </p>
              <Button onClick={onAddSection}>
                <Plus size={18} /> Add Section
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="rounded-lg border border-border bg-secondary/50 overflow-hidden"
                >
                  <div
                    className="flex items-center gap-3 p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => toggleSection(section.id)}
                  >
                    <GripVertical className="text-muted-foreground w-4 h-4" />
                    {expandedSections.has(section.id) ? (
                      <ChevronDown className="text-muted-foreground w-4 h-4" />
                    ) : (
                      <ChevronRight className="text-muted-foreground w-4 h-4" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">
                        {section.title}
                      </p>
                      <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                        <span>{section.lessons_count} lessons</span>
                        <span>~{section.duration_minutes} min</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditSection(section);
                        }}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSection(section);
                        }}
                      >
                        Manage
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSection(section.id);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                  {expandedSections.has(section.id) && (
                    <div className="border-t border-border bg-muted/30 p-4">
                      <p className="text-sm text-muted-foreground">
                        {section.summary || "No summary provided."}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <Button
            variant="outline"
            onClick={onAddSection}
            className="w-full bg-transparent"
          >
            <Plus size={18} /> Add Section
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function SectionEditor({
  section,
  courseId,
  onBack,
  onSave,
  isNew,
}: {
  section: Section | null;
  courseId: string;
  onBack: () => void;
  onSave: () => Promise<void>;
  isNew: boolean;
}) {
  const [title, setTitle] = useState(section?.title || "");
  const [summary, setSummary] = useState(section?.summary || "");
  const [order, setOrder] = useState(section?.order?.toString() || "1");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        await coursesService.createSection({
          title: title.trim(),
          summary: summary.trim() || null,
          order: Number.parseInt(order) || 1,
          course_id: courseId,
        });
      } else if (section) {
        await coursesService.updateSection(section.id, {
          title: title.trim(),
          summary: summary.trim() || null,
          order: Number.parseInt(order) || 1,
        });
      }
      await onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save section");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <button
        onClick={onBack}
        className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {isNew ? "Add Section" : "Edit Section"}
        </h1>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Card className="border-border bg-card">
        <CardContent className="p-4 md:p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Section title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Summary
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full h-24 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Brief description of this section..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Order</label>
            <Input
              type="number"
              min="1"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-24"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button onClick={onBack} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isNew ? "Create Section" : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SectionDetail({
  section,
  courseId,
  onBack,
  onEditSection,
  onSelectLesson,
  onAddLesson,
  onEditLesson,
}: {
  section: Section;
  courseId: string;
  onBack: () => void;
  onEditSection: () => void;
  onSelectLesson: (lesson: Lesson) => void;
  onAddLesson: () => void;
  onEditLesson: (lesson: Lesson) => void;
}) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLessons = async () => {
      try {
        setLoading(true);
        const data = await coursesService.listLessons(section.id);
        setLessons(data);
      } catch (err) {
        console.error("Failed to load lessons:", err);
      } finally {
        setLoading(false);
      }
    };
    loadLessons();
  }, [section.id]);

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      await coursesService.deleteLesson(lessonId);
      setLessons(lessons.filter((l) => l.id !== lessonId));
    } catch (err) {
      console.error("Failed to delete lesson:", err);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video size={14} className="text-blue-500" />;
      case "quiz":
        return <HelpCircle size={14} className="text-purple-500" />;
      default:
        return <FileText size={14} className="text-green-500" />;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <button
        onClick={onBack}
        className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
      >
        <ArrowLeft size={16} /> Back to Course
      </button>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {section.title}
          </h1>
          <p className="text-muted-foreground mt-1">
            {section.summary || "No summary"}
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground mt-2">
            <span>{lessons.length} lessons</span>
            <span>~{section.duration_minutes} min total</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEditSection}>
            <Pencil size={16} /> Edit Section
          </Button>
          <Button onClick={onAddLesson}>
            <Plus size={16} /> Add Lesson
          </Button>
        </div>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-4 md:p-6 space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Lessons ({lessons.length})
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No lessons yet. Add your first lesson.
              </p>
              <Button onClick={onAddLesson}>
                <Plus size={18} /> Add Lesson
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="py-3 flex items-center gap-3 hover:bg-accent/50 -mx-4 px-4 rounded transition-colors"
                >
                  <GripVertical className="text-muted-foreground w-4 h-4 cursor-grab" />
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => onSelectLesson(lesson)}
                  >
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground hover:text-primary transition-colors">
                        {lesson.title}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground flex items-center gap-1">
                        {getTypeIcon(lesson.content_type)}
                        {lesson.content_type}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {lesson.duration_minutes} min
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${lesson.is_published ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"}`}
                    >
                      {lesson.is_published ? "Published" : "Draft"}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEditLesson(lesson)}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => handleDeleteLesson(lesson.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button
            variant="outline"
            onClick={onAddLesson}
            className="w-full mt-4 bg-transparent"
          >
            <Plus size={18} /> Add Lesson
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function LessonDetail({
  lesson,
  onBack,
  onEdit,
}: {
  lesson: Lesson;
  onBack: () => void;
  onEdit: () => void;
}) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video size={18} className="text-blue-500" />;
      case "quiz":
        return <HelpCircle size={18} className="text-purple-500" />;
      default:
        return <FileText size={18} className="text-green-500" />;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <button
        onClick={onBack}
        className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
      >
        <ArrowLeft size={16} /> Back to Section
      </button>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {getTypeIcon(lesson.content_type)}
            <span className="text-sm text-muted-foreground capitalize">
              {lesson.content_type}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {lesson.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock size={14} /> {lesson.duration_minutes} min
            </span>
            <span
              className={`px-2 py-0.5 rounded ${lesson.is_published ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"}`}
            >
              {lesson.is_published ? "Published" : "Draft"}
            </span>
          </div>
          {lesson.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {lesson.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <Button onClick={onEdit}>
          <Pencil size={16} /> Edit Lesson
        </Button>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Content
          </h2>
          {lesson.content ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="text-foreground whitespace-pre-wrap">
                {lesson.content}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground italic">No content provided.</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Meta Information
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Slug</p>
              <p className="text-foreground font-mono">{lesson.slug}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Order</p>
              <p className="text-foreground">{lesson.order}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="text-foreground">
                {new Date(lesson.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Updated</p>
              <p className="text-foreground">
                {new Date(lesson.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LessonEditor({
  lesson,
  sectionId,
  onBack,
  onSave,
  isNew,
}: {
  lesson: Lesson | null;
  sectionId: string;
  onBack: () => void;
  onSave: () => Promise<void>;
  isNew: boolean;
}) {
  const [title, setTitle] = useState(lesson?.title || "");
  const [slug, setSlug] = useState(lesson?.slug || "");
  const [content, setContent] = useState(lesson?.content || "");
  const [contentType, setContentType] = useState<"video" | "text" | "quiz">(
    lesson?.content_type || "text"
  );
  const [duration, setDuration] = useState(
    lesson?.duration_minutes?.toString() || "10"
  );
  const [isPublished, setIsPublished] = useState(lesson?.is_published || false);
  const [tags, setTags] = useState(lesson?.tags?.join(", ") || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSlug, setAutoSlug] = useState(isNew);
  const [activeTab, setActiveTab] = useState<"content" | "meta">("content");

  useEffect(() => {
    if (autoSlug && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  }, [title, autoSlug]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const data = {
        title: title.trim(),
        slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        content: content.trim() || null,
        content_type: contentType,
        duration_minutes: Number.parseInt(duration) || 10,
        is_published: isPublished,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      if (isNew) {
        await coursesService.createLesson({ ...data, section_id: sectionId });
      } else if (lesson) {
        await coursesService.updateLesson(lesson.id, data);
      }
      await onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save lesson");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <button
        onClick={onBack}
        className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {isNew ? "Add Lesson" : "Edit Lesson"}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={onBack} variant="outline">
            Discard
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isNew ? "Create" : "Save"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("content")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "content"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Content
        </button>
        <button
          onClick={() => setActiveTab("meta")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "meta"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Meta & Settings
        </button>
      </div>

      {activeTab === "content" && (
        <Card className="border-border bg-card">
          <CardContent className="p-4 md:p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Lesson title"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Content (Markdown)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-64 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="# Lesson Content&#10;&#10;Write your lesson content here using markdown..."
              />
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "meta" && (
        <Card className="border-border bg-card">
          <CardContent className="p-4 md:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  URL Slug
                </label>
                <div className="flex gap-2">
                  <Input
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setAutoSlug(false);
                    }}
                    className="font-mono"
                  />
                  {!autoSlug && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAutoSlug(true)}
                    >
                      Auto
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Content Type
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground"
                >
                  <option value="text">Text</option>
                  <option value="video">Video</option>
                  <option value="quiz">Quiz</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Duration (minutes)
                </label>
                <Input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Tags
                </label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="react, hooks, basics"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <input
                type="checkbox"
                id="published"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              <label
                htmlFor="published"
                className="text-sm font-medium text-foreground"
              >
                Published
              </label>
              <span className="text-xs text-muted-foreground">
                Make this lesson visible to students
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
