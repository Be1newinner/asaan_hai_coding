// TypeScript types based on Swagger API schemas

// Auth Types
export interface TokenOut {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface UserRead {
  id: string
  email: string
  username: string
  is_active: boolean
  is_superuser: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  username: string
  password: string
}

// Project Types
export interface Project {
  id: string
  title: string
  slug: string
  description: string | null
  thumbnail: string | null
  status: "draft" | "published" | "archived"
  tags: string[]
  visits: number
  leads_count: number
  conversion_rate: number
  owner_id: string
  created_at: string
  updated_at: string
}

export interface ProjectCreate {
  title: string
  slug: string
  description?: string | null
  thumbnail?: string | null
  status?: "draft" | "published" | "archived"
  tags?: string[]
}

export interface ProjectUpdate {
  title?: string
  slug?: string
  description?: string | null
  thumbnail?: string | null
  status?: "draft" | "published" | "archived"
  tags?: string[]
}

// Course Types
export interface Course {
  id: string
  title: string
  slug: string
  description: string | null
  thumbnail: string | null
  price: number
  status: "draft" | "published" | "hidden"
  sections_count: number
  lessons_count: number
  students_count: number
  progress: number
  owner_id: string
  created_at: string
  updated_at: string
}

export interface CourseCreate {
  title: string
  slug: string
  description?: string | null
  thumbnail?: string | null
  price?: number
  status?: "draft" | "published" | "hidden"
}

export interface CourseUpdate {
  title?: string
  slug?: string
  description?: string | null
  thumbnail?: string | null
  price?: number
  status?: "draft" | "published" | "hidden"
}

// Section Types
export interface Section {
  id: string
  title: string
  summary: string | null
  order: number
  course_id: string
  lessons_count: number
  duration_minutes: number
  created_at: string
  updated_at: string
}

export interface SectionCreate {
  title: string
  summary?: string | null
  order?: number
  course_id: string
}

export interface SectionUpdate {
  title?: string
  summary?: string | null
  order?: number
}

// Lesson Types
export interface Lesson {
  id: string
  title: string
  content: string | null
  content_type: "video" | "text" | "quiz"
  duration_minutes: number
  order: number
  is_published: boolean
  section_id: string
  slug: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface LessonCreate {
  title: string
  content?: string | null
  content_type?: "video" | "text" | "quiz"
  duration_minutes?: number
  order?: number
  is_published?: boolean
  section_id: string
  slug?: string
  tags?: string[]
}

export interface LessonUpdate {
  title?: string
  content?: string | null
  content_type?: "video" | "text" | "quiz"
  duration_minutes?: number
  order?: number
  is_published?: boolean
  slug?: string
  tags?: string[]
}

// Profile Types
export interface Profile {
  id: string
  name: string
  title: string
  tagline: string | null
  avatar: string | null
  location: string | null
  bio: string | null
  linkedin_url: string | null
  youtube_url: string | null
  website_url: string | null
  skills: string[]
  experience: ExperienceItem[]
  user_id: string
  created_at: string
  updated_at: string
}

export interface ExperienceItem {
  id: string
  role: string
  organization: string
  start_date: string
  end_date: string | null
  description: string | null
  is_current: boolean
}

export interface ProfileCreate {
  name: string
  title: string
  tagline?: string | null
  avatar?: string | null
  location?: string | null
  bio?: string | null
  linkedin_url?: string | null
  youtube_url?: string | null
  website_url?: string | null
  skills?: string[]
  experience?: ExperienceItem[]
}

export interface ProfileUpdate {
  name?: string
  title?: string
  tagline?: string | null
  avatar?: string | null
  location?: string | null
  bio?: string | null
  linkedin_url?: string | null
  youtube_url?: string | null
  website_url?: string | null
  skills?: string[]
  experience?: ExperienceItem[]
}

// Lead Types (keeping existing)
export interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  country: string | null
  timezone: string | null
  status: "new" | "contacted" | "converted" | "lost"
  source: "landing" | "course" | "webinar" | "referral"
  notes: string | null
  owner_id: string | null
  utm_campaign: string | null
  utm_source: string | null
  created_at: string
  updated_at: string
}

// Paginated Response
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

// API Error
export interface ApiError {
  detail: string | { msg: string; type: string }[]
}
