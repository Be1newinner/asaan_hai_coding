"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Linkedin,
  Youtube,
  Globe,
  MapPin,
  Edit2,
  Plus,
  Trash2,
  ArrowLeft,
  Loader2,
  X,
  GripVertical,
  Calendar,
  Building2,
  User,
} from "lucide-react"
import { profileService } from "@/lib/api/services/profile"
import type { Profile, ProfileUpdate, ExperienceItem } from "@/lib/api/types"

export default function ProfileView() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await profileService.get()
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const handleSave = async (data: ProfileUpdate) => {
    try {
      const updated = await profileService.update(data)
      setProfile(updated)
      setIsEditing(false)
    } catch (err) {
      throw err
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          {error || "Profile not found"}
        </div>
      </div>
    )
  }

  if (isEditing) {
    return <ProfileEditor profile={profile} onBack={() => setIsEditing(false)} onSave={handleSave} />
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">About Me</h1>
        <Button onClick={() => setIsEditing(true)}>
          <Edit2 size={18} />
          Edit Profile
        </Button>
      </div>

      {/* Hero Section */}
      <Card className="border-border bg-card">
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-4xl font-bold text-white flex-shrink-0 overflow-hidden">
              {profile.avatar ? (
                <img
                  src={profile.avatar || "/placeholder.svg"}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(profile.name)
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{profile.name}</h1>
              <p className="text-lg text-primary font-semibold">{profile.title}</p>
              {profile.tagline && <p className="text-muted-foreground leading-relaxed max-w-2xl">{profile.tagline}</p>}

              {/* Location */}
              {profile.location && (
                <div className="flex items-center gap-2 text-muted-foreground pt-2">
                  <MapPin size={18} />
                  <span>{profile.location}</span>
                </div>
              )}

              {/* Social Links */}
              <div className="flex gap-3 pt-4">
                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
                  >
                    <Linkedin size={20} className="text-blue-500" />
                  </a>
                )}
                {profile.youtube_url && (
                  <a
                    href={profile.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
                  >
                    <Youtube size={20} className="text-red-500" />
                  </a>
                )}
                {profile.website_url && (
                  <a
                    href={profile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
                  >
                    <Globe size={20} className="text-cyan-500" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Experience */}
      {profile.experience.length > 0 && (
        <Card className="border-border bg-card">
          <CardContent className="p-4 md:p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Professional Experience</h2>

            <div className="space-y-4">
              {profile.experience.map((exp, i) => (
                <div key={exp.id} className="relative pl-6 pb-6 last:pb-0">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-0 top-2 w-3 h-3 rounded-full ${exp.is_current ? "bg-primary" : "bg-muted-foreground"}`}
                  />
                  {/* Timeline line */}
                  {i !== profile.experience.length - 1 && (
                    <div className="absolute left-[5px] top-6 w-0.5 h-full bg-border" />
                  )}

                  <div className="space-y-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                      <h3 className="font-semibold text-foreground">{exp.role}</h3>
                      <span className="text-sm text-muted-foreground">
                        {new Date(exp.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        {" - "}
                        {exp.is_current || !exp.end_date
                          ? "Present"
                          : new Date(exp.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{exp.organization}</p>
                    {exp.description && <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills */}
      {profile.skills.length > 0 && (
        <Card className="border-border bg-card">
          <CardContent className="p-4 md:p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Skills & Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span key={skill} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* About Section */}
      {profile.bio && (
        <Card className="border-border bg-card">
          <CardContent className="p-4 md:p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">About</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ProfileEditor({
  profile,
  onBack,
  onSave,
}: {
  profile: Profile
  onBack: () => void
  onSave: (data: ProfileUpdate) => Promise<void>
}) {
  const [name, setName] = useState(profile.name)
  const [title, setTitle] = useState(profile.title)
  const [tagline, setTagline] = useState(profile.tagline || "")
  const [location, setLocation] = useState(profile.location || "")
  const [avatar, setAvatar] = useState(profile.avatar || "")
  const [bio, setBio] = useState(profile.bio || "")
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedin_url || "")
  const [youtubeUrl, setYoutubeUrl] = useState(profile.youtube_url || "")
  const [websiteUrl, setWebsiteUrl] = useState(profile.website_url || "")
  const [skills, setSkills] = useState(profile.skills.join(", "))
  const [experience, setExperience] = useState<ExperienceItem[]>([...profile.experience])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Experience editing
  const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null)
  const [showExperienceForm, setShowExperienceForm] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Name is required")
      return
    }
    if (!title.trim()) {
      setError("Title is required")
      return
    }

    setSaving(true)
    setError(null)

    try {
      await onSave({
        name: name.trim(),
        title: title.trim(),
        tagline: tagline.trim() || null,
        location: location.trim() || null,
        avatar: avatar.trim() || null,
        bio: bio.trim() || null,
        linkedin_url: linkedinUrl.trim() || null,
        youtube_url: youtubeUrl.trim() || null,
        website_url: websiteUrl.trim() || null,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        experience,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  const addExperience = (exp: Omit<ExperienceItem, "id">) => {
    const newExp: ExperienceItem = {
      ...exp,
      id: Math.random().toString(36).substring(2, 15),
    }
    setExperience([newExp, ...experience])
    setShowExperienceForm(false)
  }

  const updateExperience = (id: string, data: Partial<ExperienceItem>) => {
    setExperience(experience.map((e) => (e.id === id ? { ...e, ...data } : e)))
    setEditingExperience(null)
  }

  const deleteExperience = (id: string) => {
    setExperience(experience.filter((e) => e.id !== id))
  }

  const getInitials = (n: string) => {
    return n
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <button
        onClick={onBack}
        className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
      >
        <ArrowLeft size={16} />
        Back to Profile
      </button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Edit Profile</h1>
          <p className="text-muted-foreground">Update your professional information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            Discard
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Save Profile
          </Button>
        </div>
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
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="border-border bg-card">
            <CardContent className="p-4 md:p-6 space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>

              {/* Avatar Preview */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 overflow-hidden">
                  {avatar ? (
                    <img src={avatar || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(name || "U")
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-foreground">Avatar URL</label>
                  <Input
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Title <span className="text-destructive">*</span>
                  </label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Tagline</label>
                  <Input
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Brief tagline or motto"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Location</label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Bio (Markdown)</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full h-32 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Tell your story..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card className="border-border bg-card">
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Professional Experience</h2>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingExperience(null)
                    setShowExperienceForm(true)
                  }}
                >
                  <Plus size={16} /> Add
                </Button>
              </div>

              {/* Experience Form */}
              {(showExperienceForm || editingExperience) && (
                <ExperienceForm
                  experience={editingExperience}
                  onSave={(data) => {
                    if (editingExperience) {
                      updateExperience(editingExperience.id, data)
                    } else {
                      addExperience(data as Omit<ExperienceItem, "id">)
                    }
                  }}
                  onCancel={() => {
                    setShowExperienceForm(false)
                    setEditingExperience(null)
                  }}
                />
              )}

              {/* Experience List */}
              {experience.length === 0 && !showExperienceForm ? (
                <p className="text-muted-foreground text-center py-4">No experience added yet.</p>
              ) : (
                <div className="space-y-3">
                  {experience.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-4 border border-border rounded-lg bg-secondary/30 flex items-start gap-3"
                    >
                      <GripVertical className="text-muted-foreground w-4 h-4 mt-1 cursor-grab flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-foreground">{exp.role}</p>
                            <p className="text-sm text-muted-foreground">{exp.organization}</p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button size="sm" variant="ghost" onClick={() => setEditingExperience(exp)}>
                              <Edit2 size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => deleteExperience(exp.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(exp.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                          {" - "}
                          {exp.is_current || !exp.end_date
                            ? "Present"
                            : new Date(exp.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </p>
                        {exp.description && <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Social Links */}
          <Card className="border-border bg-card">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Social Links</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Linkedin size={16} className="text-blue-500" />
                    LinkedIn
                  </label>
                  <Input
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Youtube size={16} className="text-red-500" />
                    YouTube
                  </label>
                  <Input
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/@..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Globe size={16} className="text-cyan-500" />
                    Website
                  </label>
                  <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://..." />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="border-border bg-card">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Skills & Technologies</h2>
              <div className="space-y-2">
                <Input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, TypeScript, Node.js..."
                />
                <p className="text-xs text-muted-foreground">Separate skills with commas</p>
              </div>
              {skills && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {skills
                    .split(",")
                    .map((s, i) => s.trim())
                    .filter(Boolean)
                    .map((skill, i) => (
                      <span key={i} className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">
                        {skill}
                      </span>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ExperienceForm({
  experience,
  onSave,
  onCancel,
}: {
  experience: ExperienceItem | null
  onSave: (data: Partial<ExperienceItem>) => void
  onCancel: () => void
}) {
  const [role, setRole] = useState(experience?.role || "")
  const [organization, setOrganization] = useState(experience?.organization || "")
  const [startDate, setStartDate] = useState(experience?.start_date || "")
  const [endDate, setEndDate] = useState(experience?.end_date || "")
  const [isCurrent, setIsCurrent] = useState(experience?.is_current || false)
  const [description, setDescription] = useState(experience?.description || "")

  const handleSubmit = () => {
    if (!role.trim() || !organization.trim() || !startDate) return
    onSave({
      role: role.trim(),
      organization: organization.trim(),
      start_date: startDate,
      end_date: isCurrent ? null : endDate || null,
      is_current: isCurrent,
      description: description.trim() || null,
    })
  }

  return (
    <div className="p-4 border border-primary/30 rounded-lg bg-primary/5 space-y-4">
      <h3 className="font-medium text-foreground">{experience ? "Edit Experience" : "Add Experience"}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <User size={14} /> Role <span className="text-destructive">*</span>
          </label>
          <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Software Engineer" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Building2 size={14} /> Organization <span className="text-destructive">*</span>
          </label>
          <Input value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="Company Name" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Calendar size={14} /> Start Date <span className="text-destructive">*</span>
          </label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Calendar size={14} /> End Date
          </label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={isCurrent} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isCurrent"
          checked={isCurrent}
          onChange={(e) => setIsCurrent(e.target.checked)}
          className="w-4 h-4 rounded border-border"
        />
        <label htmlFor="isCurrent" className="text-sm text-foreground">
          I currently work here
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-20 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Brief description of your role..."
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSubmit} disabled={!role.trim() || !organization.trim() || !startDate}>
          {experience ? "Update" : "Add"}
        </Button>
      </div>
    </div>
  )
}
