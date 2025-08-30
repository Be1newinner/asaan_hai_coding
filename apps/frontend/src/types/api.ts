export interface BodyLoginApiV1AuthLoginPost {
  grant_type?: string | null;
  username: string;
  password: string;
  scope?: string;
  client_id?: string | null;
  client_secret?: string | null;
}

export interface BodyResetPasswordApiV1AuthResetPasswordPatch {
  grant_type?: string | null;
  username: string;
  password: string;
  scope?: string;
  client_id?: string | null;
  client_secret?: string | null;
}

// USER TYPES =====================

export interface UserCreate {
  username: string;
  password: string;
  email: string;
  full_name: string;
  contact?: string | null;
  role?: "ADMIN" | "USER" | "MODERATOR";
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
}

export interface UserUpdate {
  full_name?: string | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  contact?: string | null;
}

export interface UserRead {
  id: string;
  username: string;
  email: string;
  full_name: string;
  contact: string | null;
  gender: UserGender | null;
  role: UserRole;
  created_at?: string | null;
  updated_at?: string | null;
}

export enum UserGender {
  "MALE",
  "FEMALE",
  "OTHER",
}

export enum UserRole {
  "ADMIN",
  "USER",
  "MODERATOR",
}

// LESSON TYPES ===============================

export interface LessonRead {
  id: number;
  section_id: number;
  course_id: string;
  title: string;
  content: string;
  lesson_order: number;
}

// SECTION TYPES ==========================

export interface SectionRead {
  id: number;
  course_id: string;
  title: string;
  section_order: number;
  lessons: LessonRead[];
}

export interface SectionCreate {
  course_id: string;
  title: string;
  section_order: number;
}

export interface SectionReadBase {
  id: number;
  course_id: string;
  title: string;
  section_order: number;
}

export interface SectionUpdate {
  title?: string | null;
  section_order?: number | null;
}

// COURSE TYPES ==========================

export interface CourseRead {
  created_at: string;
  updated_at: string;
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  difficulty_level: string;
  is_published: boolean;
  image?: {
    id: string;
    secure_url: string;
  };
  category?: string;
  sections: SectionRead[];
}

export interface CourseReadBase extends CourseRead {}

export interface CourseCreate {
  title: string;
  description?: string | null;
  instructor_id?: string | null;
  difficulty_level?: string | null;
  is_published?: boolean;
}

export interface CourseUpdate {
  title?: string | null;
  description?: string | null;
  instructor_id?: string | null;
  difficulty_level?: string | null;
  is_published?: boolean | null;
}

export interface LessonCreate {
  section_id: number;
  title: string;
  content?: string | null;
  lesson_order: number;
}

export interface LessonUpdate {
  title?: string | null;
  content?: string | null;
  lesson_order?: number | null;
}

export interface ProjectCreate {
  title: string;
  description?: string | null;
  client_name?: string | null;
  project_type?: string | null;
  thumbnail_url?: string | null;
  live_demo_url?: string | null;
  github_url?: string | null;
  is_published?: boolean;
}

export interface ProjectRead {
  id: number;
  title: string;
  description?: string | null;
  client_name?: string | null;
  project_type?: string | null;
  thumbnail_image?: {
    id: string;
    secure_url: string;
  } | null;
  live_demo_url?: string | null;
  github_url?: string | null;
  is_published: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  detail?: ProjectDetailRead | null;
}

export interface ProjectUpdate {
  title?: string | null;
  description?: string | null;
  client_name?: string | null;
  project_type?: string | null;
  thumbnail_url?: string | null;
  live_demo_url?: string | null;
  github_url?: string | null;
  is_published?: boolean | null;
}

export interface ProjectDetailCreate {
  markdown_content: string;
}

export interface ProjectDetailRead {
  markdown_content: string;
}

export interface ProjectDetailUpdate {
  markdown_content?: string | null;
}
