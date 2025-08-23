export type BodyLoginApiV1AuthLoginPost = {
  grant_type?: string | null;
  username: string;
  password: string;
  scope?: string;
  client_id?: string | null;
  client_secret?: string | null;
};

export type BodyResetPasswordApiV1AuthResetPasswordPatch = {
  grant_type?: string | null;
  username: string;
  password: string;
  scope?: string;
  client_id?: string | null;
  client_secret?: string | null;
};

export type CourseCreate = {
  title: string;
  description?: string | null;
  instructor_id?: string | null;
  difficulty_level?: string | null;
  is_published?: boolean;
};

export type CourseRead = {
  created_at?: string | null;
  updated_at?: string | null;
  id: string;
  title: string;
  description?: string | null;
  instructor_id?: string | null;
  difficulty_level?: string | null;
  is_published: boolean;
  sections?: SectionRead[];
};

export type CourseReadBase = {
  created_at?: string | null;
  updated_at?: string | null;
  id: string;
  title: string;
  description?: string | null;
  instructor_id?: string | null;
  difficulty_level?: string | null;
  is_published: boolean;
};

export type CourseUpdate = {
  title?: string | null;
  description?: string | null;
  instructor_id?: string | null;
  difficulty_level?: string | null;
  is_published?: boolean | null;
};

export type HTTPValidationError = {
  detail?: ValidationError[];
};

export type LessonCreate = {
  section_id: number;
  title: string;
  content?: string | null;
  lesson_order: number;
};

export type LessonRead = {
  id: number;
  section_id: number;
  title: string;
  content?: string | null;
  lesson_order: number;
};

export type LessonUpdate = {
  title?: string | null;
  content?: string | null;
  lesson_order?: number | null;
};

export type ProjectCreate = {
  title: string;
  description?: string | null;
  client_name?: string | null;
  project_type?: string | null;
  thumbnail_url?: string | null;
  live_demo_url?: string | null;
  github_url?: string | null;
  is_published?: boolean;
};

export type ProjectDetailCreate = {
  markdown_content: string;
};

export type ProjectDetailRead = {
  markdown_content: string;
};

export type ProjectDetailUpdate = {
  markdown_content?: string | null;
};

export type ProjectRead = {
  created_at?: string | null;
  updated_at?: string | null;
  id: number;
  title: string;
  description?: string | null;
  client_name?: string | null;
  project_type?: string | null;
  thumbnail_url?: string | null;
  live_demo_url?: string | null;
  github_url?: string | null;
  is_published: boolean;
  detail?: ProjectDetailRead | null;
};

export type ProjectUpdate = {
  title?: string | null;
  description?: string | null;
  client_name?: string | null;
  project_type?: string | null;
  thumbnail_url?: string | null;
  live_demo_url?: string | null;
  github_url?: string | null;
  is_published?: boolean | null;
};

export type SectionCreate = {
  course_id: string;
  title: string;
  section_order: number;
};

export type SectionRead = {
  id: number;
  course_id: string;
  title: string;
  section_order: number;
  lessons?: LessonRead[];
};

export type SectionReadBase = {
  id: number;
  course_id: string;
  title: string;
  section_order: number;
};

export type SectionUpdate = {
  title?: string | null;
  section_order?: number | null;
};

export type TokenOut = {
  access_token: string;
  token_type?: string;
};

export type UserCreate = {
  username: string;
  password: string;
  email: string;
  full_name: string;
  contact: string;
  role?: UserRole;
  gender?: UserGender | null;
};

export enum UserGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export type UserRead = {
  created_at?: string | null;
  updated_at?: string | null;
  id: string;
  username: string;
  email: string;
  full_name: string;
  contact?: string | null;
  gender?: UserGender | null;
  role: UserRole;
};

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  MODERATOR = "MODERATOR",
}

export type UserUpdate = {
  full_name?: string | null;
  gender?: UserGender | null;
  contact?: string | null;
};

export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
};