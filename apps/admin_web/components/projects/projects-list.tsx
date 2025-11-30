"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Pencil,
  Eye,
  MoreVertical,
  Trash2,
  Copy,
  ArrowLeft,
  ExternalLink,
  TrendingUp,
  Users,
  BarChart3,
  X,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { projectsService } from "@/lib/api/services/projects";
import type { Project, ProjectCreate, ProjectUpdate } from "@/lib/api/types";

export default function ProjectsList() {
  const [view, setView] = useState<"list" | "detail" | "editor">("list");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCreating, setIsCreating] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectsService.list({
        status: filterStatus !== "all" ? filterStatus : undefined,
      });
      setProjects(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleDelete = async (id: string) => {
    try {
      await projectsService.delete(id);
      await loadProjects();
      if (selectedProject?.id === id) {
        setSelectedProject(null);
        setView("list");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  const handleSave = async (
    data: ProjectCreate | ProjectUpdate,
    isNew: boolean
  ) => {
    try {
      if (isNew) {
        await projectsService.create(data as ProjectCreate);
      } else if (selectedProject) {
        await projectsService.update(selectedProject.id, data as ProjectUpdate);
      }
      await loadProjects();
      setView("list");
      setIsCreating(false);
    } catch (err) {
      throw err;
    }
  };

  const filteredProjects = projects
    .filter((p) => {
      const matchesSearch = p.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      if (sortBy === "oldest")
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      if (sortBy === "leads") return b.leads_count - a.leads_count;
      return 0;
    });

  if (view === "detail" && selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        onBack={() => setView("list")}
        onEdit={() => setView("editor")}
        onDelete={() => handleDelete(selectedProject.id)}
      />
    );
  }

  if (view === "editor" && (selectedProject || isCreating)) {
    return (
      <ProjectEditor
        project={isCreating ? null : selectedProject}
        onBack={() => {
          setView("list");
          setIsCreating(false);
        }}
        onSave={handleSave}
        isNew={isCreating}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Projects
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage and track all your projects
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedProject(null);
            setIsCreating(true);
            setView("editor");
          }}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
        >
          <Plus size={18} />
          New Project
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-3 text-muted-foreground"
            size={18}
          />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="leads">Most Leads</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No projects found
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "Try adjusting your search or filters"
              : "Get started by creating your first project"}
          </p>
          {!searchQuery && (
            <Button
              onClick={() => {
                setIsCreating(true);
                setView("editor");
              }}
            >
              <Plus size={18} />
              Create Project
            </Button>
          )}
        </div>
      )}

      {/* Projects Grid */}
      {!loading && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onView={() => {
                setSelectedProject(project);
                setView("detail");
              }}
              onEdit={() => {
                setSelectedProject(project);
                setView("editor");
              }}
              onDelete={() => handleDelete(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  onView,
  onEdit,
  onDelete,
}: {
  project: Project;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="border-border bg-card hover:bg-accent/50 transition-colors">
      <CardContent className="p-4 space-y-4">
        {/* Thumbnail */}
        <div
          className="w-full h-32 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={onView}
        >
          {project.thumbnail ? (
            <img
              src={project.thumbnail || "/placeholder.svg"}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-12 h-12 text-muted-foreground" />
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3
              className="font-semibold text-foreground line-clamp-2 cursor-pointer hover:text-primary transition-colors"
              onClick={onView}
            >
              {project.title}
            </h3>
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
                    <button className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2">
                      <Copy size={14} /> Duplicate
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
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                project.status === "published"
                  ? "bg-green-500/20 text-green-500"
                  : project.status === "draft"
                    ? "bg-yellow-500/20 text-yellow-500"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
            {project.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
            <span>Created {formatDate(project.created_at)}</span>
            <span>Updated {formatDate(project.updated_at)}</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="bg-muted p-2 rounded text-center">
              <p className="text-xs text-muted-foreground">Visits</p>
              <p className="text-sm font-semibold text-foreground">
                {project.visits.toLocaleString()}
              </p>
            </div>
            <div className="bg-muted p-2 rounded text-center">
              <p className="text-xs text-muted-foreground">Leads</p>
              <p className="text-sm font-semibold text-foreground">
                {project.leads_count}
              </p>
            </div>
            <div className="bg-muted p-2 rounded text-center">
              <p className="text-xs text-muted-foreground">Conv.</p>
              <p className="text-sm font-semibold text-foreground">
                {project.conversion_rate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectDetail({
  project,
  onBack,
  onEdit,
  onDelete,
}: {
  project: Project;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <button
        onClick={onBack}
        className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
      >
        <ArrowLeft size={16} />
        Back to Projects
      </button>

      {/* Hero */}
      <div className="space-y-4">
        <div className="w-full h-48 md:h-64 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center overflow-hidden">
          {project.thumbnail ? (
            <img
              src={project.thumbnail || "/placeholder.svg"}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-16 h-16 text-muted-foreground" />
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {project.title}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  project.status === "published"
                    ? "bg-green-500/20 text-green-500"
                    : project.status === "draft"
                      ? "bg-yellow-500/20 text-yellow-500"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {project.status.toUpperCase()}
              </span>
              {project.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">/{project.slug}</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm">
              <ExternalLink size={16} />
              View Public
            </Button>
            <Button onClick={onEdit} size="sm">
              <Pencil size={16} />
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <Card className="border-border bg-card">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 size={20} />
            Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Eye size={16} />
                <span className="text-sm">Visits</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {project.visits.toLocaleString()}
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users size={16} />
                <span className="text-sm">Leads</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {project.leads_count}
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp size={16} />
                <span className="text-sm">Conversion</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {project.conversion_rate.toFixed(1)}%
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <BarChart3 size={16} />
                <span className="text-sm">Avg. Time</span>
              </div>
              <p className="text-2xl font-bold text-foreground">2:34</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview */}
      <Card className="border-border bg-card">
        <CardContent className="p-4 md:p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Overview</h2>
          {project.description ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="text-muted-foreground whitespace-pre-wrap">
                {project.description}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              No description provided.
            </p>
          )}
          <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border">
            <p>Created: {formatDate(project.created_at)}</p>
            <p>Last updated: {formatDate(project.updated_at)}</p>
            <p>Owner ID: {project.owner_id}</p>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md border-border bg-card">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Delete Project?
              </h3>
              <p className="text-muted-foreground">
                This will permanently delete "{project.title}" and all
                associated data. This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete();
                    setShowDeleteConfirm(false);
                  }}
                >
                  Delete Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Danger Zone */}
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            Danger Zone
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete a project, there is no going back. Please be
            certain.
          </p>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 size={16} />
            Delete Project
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ProjectEditor({
  project,
  onBack,
  onSave,
  isNew,
}: {
  project: Project | null;
  onBack: () => void;
  onSave: (
    data: ProjectCreate | ProjectUpdate,
    isNew: boolean
  ) => Promise<void>;
  isNew: boolean;
}) {
  const [title, setTitle] = useState(project?.title || "");
  const [slug, setSlug] = useState(project?.slug || "");
  const [description, setDescription] = useState(project?.description || "");
  const [status, setStatus] = useState<"draft" | "published" | "archived">(
    project?.status || "draft"
  );
  const [tags, setTags] = useState(project?.tags?.join(", ") || "");
  const [thumbnail, setThumbnail] = useState(project?.thumbnail || "");
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

  const handleSubmit = async (publishStatus?: "draft" | "published") => {
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
      const data: ProjectCreate | ProjectUpdate = {
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        thumbnail: thumbnail.trim() || null,
        status: publishStatus || status,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      await onSave(data, isNew);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <button
        onClick={onBack}
        className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
      >
        <ArrowLeft size={16} />
        Back to Projects
      </button>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {isNew ? "Create New Project" : "Edit Project"}
        </h1>
        <p className="text-muted-foreground">
          {isNew ? "Set up your new project" : "Update your project details"}
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
        {/* Main Form */}
        <Card className="border-border bg-card lg:col-span-2">
          <CardContent className="p-4 md:p-6 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
              />
            </div>

            {/* URL Slug */}
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
                  placeholder="project-url-slug"
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
              <p className="text-xs text-muted-foreground">
                This will be used in the public URL: /projects/
                {slug || "your-slug"}
              </p>
            </div>

            {/* Thumbnail URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Thumbnail URL
              </label>
              <Input
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://example.com/image.jpg"
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

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Tags
              </label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="React, Node.js, PostgreSQL"
              />
              <p className="text-xs text-muted-foreground">
                Separate tags with commas
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Description (Markdown)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-48 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="# Project Overview&#10;&#10;Describe your project here using markdown..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card className="border-border bg-card">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Status</h3>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as "draft" | "published" | "archived"
                  )
                }
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              <p className="text-xs text-muted-foreground">
                {status === "draft" && "Draft projects are only visible to you"}
                {status === "published" &&
                  "Published projects are visible to everyone"}
                {status === "archived" &&
                  "Archived projects are hidden but not deleted"}
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="border-border bg-card">
            <CardContent className="p-4 md:p-6 space-y-3">
              <h3 className="font-semibold text-foreground">Actions</h3>
              <Button
                onClick={() => handleSubmit()}
                disabled={saving}
                className="w-full"
                variant="outline"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Save Draft
              </Button>
              <Button
                onClick={() => handleSubmit("published")}
                disabled={saving}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Save & Publish
              </Button>
              <Button onClick={onBack} variant="ghost" className="w-full">
                Discard Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
