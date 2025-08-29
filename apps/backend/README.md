## PGSQL Tables

#### **1. `users` table**

_Purpose: Stores all user account information._

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE user_role AS ENUM ('ADMIN', 'USER', 'MODERATOR');

CREATE TYPE user_gender AS ENUM ('MALE', 'FEMALE', 'OTHER');

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    contact VARCHAR(20),
    role user_gender,
    role user_role NOT NULL DEFAULT 'USER',
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### **2. `courses` table**

_Purpose: The main catalog of all courses on the platform._

```sql
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN DEFAULT FALSE,
    difficulty_level VARCHAR(20)
);

CREATE INDEX idx_courses_instructor_id ON courses(instructor_id);
```

#### **3. `sections` table**

_Purpose: Organizes courses into logical modules or units._

```sql
CREATE TABLE sections (
    section_id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    section_order INT NOT NULL,
    UNIQUE (course_id, section_order)
);

CREATE INDEX idx_sections_course_id ON sections(course_id);
```

#### **4. `lessons` table**

_Purpose: Stores the core text-based tutorial content and links to its section._

```sql
CREATE TABLE lessons (
    lesson_id SERIAL PRIMARY KEY,
    section_id INT REFERENCES sections(section_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    lesson_order INT NOT NULL,
    UNIQUE (section_id, lesson_order)
);

CREATE INDEX idx_lessons_section_id ON lessons(section_id);
```

#### **5. `video_snippets` table**

_Purpose: Stores metadata for video content, linked to a specific lesson._

```sql
CREATE TABLE video_snippets (
    video_id SERIAL PRIMARY KEY,
    lesson_id INT REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    url VARCHAR(255) NOT NULL,
    description TEXT,
    start_time_seconds INT,
    end_time_seconds INT
);

CREATE INDEX idx_video_snippets_lesson_id ON video_snippets(lesson_id);
```

#### **6. `projects` table**

_Purpose: Stores metadata for the company's client showcase portfolio._

```sql
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    client_name VARCHAR(100),
    project_type VARCHAR(50),
    thumbnail_url VARCHAR(255),
    live_demo_url VARCHAR(255),
    github_url VARCHAR(255),
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### **7. `project_details` table**

_Purpose: Stores the large, detailed markdown content for a project in a separate table for performance optimization._

```sql
CREATE TABLE project_details (
    project_id INT PRIMARY KEY REFERENCES projects(project_id) ON DELETE CASCADE,
    markdown_content TEXT NOT NULL
);
```

## Folder Structure

```
asaan_haic_coding/
│
├── app/
│   ├── api/                 # API routers (split by domain)
│   │   ├── v1/
│   │   │   ├── users.py
│   │   │   ├── courses.py
│   │   │   ├── projects.py
│   │   │   └── __init__.py
│   │   └── __init__.py
│   │
│   ├── core/                # Core configs & startup logic
│   │   ├── config.py
│   │   ├── security.py      # Auth, password hashing, JWT
│   │   └── __init__.py
│   │
│   ├── models/              # SQLAlchemy ORM models
│   │   ├── user.py
│   │   ├── course.py
│   │   ├── project.py
│   │   ├── section.py
│   │   ├── lesson.py
│   │   └── __init__.py
│   │
│   ├── schemas/             # Pydantic schemas (request/response)
│   │   ├── user.py
│   │   ├── course.py
│   │   ├── project.py
│   │   └── __init__.py
│   │
│   ├── crud/                # Data access layer functions
│   │   ├── user.py
│   │   ├── course.py
│   │   ├── project.py
│   │   └── __init__.py
│   │
│   ├── db/
│   │   ├── base.py          # Base metadata
│   │   ├── session.py       # DB session creation
│   │   └── init_db.py
│   │
│   ├── main.py              # FastAPI app entry
│   └── __init__.py
│
├── tests/                   # Unit and integration tests
│   ├── test_users.py
│   ├── test_courses.py
│   └── test_projects.py
│
├── alembic/                 # DB migrations
├── alembic.ini
├── pyproject.toml / requirements.txt
└── README.md
```

## **API Structure — Grouped by Domain**

### **Courses & Learning Content**

**Public:**

- `GET /api/v1/courses` → List published courses _(filters: difficulty_level, search, pagination)_
- `GET /api/v1/courses/{id_or_slug}` → Get single course details _(includes sections → lessons → video snippets)_
- `GET /api/v1/courses/{id_or_slug}/sections` → List sections for a course
- `GET /api/v1/courses/{id_or_slug}/lessons` → List all lessons (optionally filter by section)
- `GET /api/v1/lessons/{lesson_id}` → Get single lesson content with videos

**Admin (JWT: role=ADMIN):**

- `POST /api/v1/courses` → Create a new course
- `PUT /api/v1/courses/{id_or_slug}` → Update course details
- `DELETE /api/v1/courses/{id_or_slug}` → Delete course _(soft delete optional)_
- `PATCH /api/v1/courses/{id_or_slug}/publish` → Publish/unpublish a course

- `POST /api/v1/sections` → Create a section
- `PUT /api/v1/sections/{section_id}` → Update a section
- `DELETE /api/v1/sections/{section_id}` → Delete a section

- `POST /api/v1/lessons` → Create a lesson
- `PUT /api/v1/lessons/{lesson_id}` → Update lesson content
- `DELETE /api/v1/lessons/{lesson_id}` → Delete lesson

- `POST /api/v1/video-snippets` → Add a video snippet to a lesson
- `PUT /api/v1/video-snippets/{video_id}` → Update video snippet metadata
- `DELETE /api/v1/video-snippets/{video_id}` → Delete snippet

---

### **Projects & Portfolio**

**Public:**

- `GET /api/v1/projects` → List published projects _(filters: project_type, search, featured)_
- `GET /api/v1/projects/{id_or_slug}` → Project details _(includes markdown content rendered to HTML)_

**Admin (JWT: role=ADMIN):**

- `POST /api/v1/projects` → Create project metadata
- `PUT /api/v1/projects/{id_or_slug}` → Update project metadata
- `DELETE /api/v1/projects/{id_or_slug}` → Delete project
- `PATCH /api/v1/projects/{id_or_slug}/publish` → Publish/unpublish

- `POST /api/v1/project-details/{project_id}` → Add/update markdown content
- `PUT /api/v1/project-details/{project_id}` → Update markdown content
- `DELETE /api/v1/project-details/{project_id}` → Delete

---

### **User & Auth (Admin Management Only)**

**Admin:**

- `POST /api/v1/auth/login` → Admin login, returns JWT
- `POST /api/v1/users` → Create admin/moderator user
- `GET /api/v1/users` → List users _(optional)_
- `GET /api/v1/users/{user_id}` → Get user details
- `PUT /api/v1/users/{user_id}` → Update user details or role
- `DELETE /api/v1/users/{user_id}` → Delete a user

### DOCKER FILES CHECKSUM ( SHA256 )

- build hash for 1.2.5 => 0be36798dc0000ecaa540ba7ea1fb010c9f58e01f29495ac8d7c8e6d9a573317

- base image hash for 1.2.5 => N/A

- build hash for 1.2.6 => ff77cedfd1ca9fa3f14e545bd6bd02c2c322f810bf5d1baf68fc5e1c90b96d2e

- base image hash for 1.2.6 => 2369e04b10806f5d8aeeb70ecdbd68d24608b5d201229e3f380a69e9fcb4c9cd

### Checking Digest

- if used hub
  `docker images --digests`

- the running containers
    `docker inspect -f '{{.Image}}' <container_id>`