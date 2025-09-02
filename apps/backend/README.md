## Overview

This repository contains the backend for Asaan Hai Coding, a production-ready FastAPI service with async SQLAlchemy 2.0, PostgreSQL, Alembic migrations, JWT-based auth, media management via Cloudinary, and an AI content pipeline using Google Gemini for generating course lessons. The service exposes REST APIs grouped by domain (auth, users, courses, sections, lessons, projects, media, AI handler) and ships with Docker-based local/dev flows and private deployment scripts, including GitHub release automation for image artifacts.

## Tech stack

- FastAPI with lifespan hooks, custom exception handlers, CORS, modular routers, and typed Pydantic v2 schemas.
- Async SQLAlchemy 2.0 ORM with asyncpg driver, connection pooling, session dependency, and eager loading patterns (selectinload, joinedload).
- PostgreSQL with Alembic migrations, async migration env, and compare_type/server_default enabled.
- Authlib JWT for stateless access/refresh tokens, bcrypt password hashing, and role-based route guards (ADMIN).
- Cloudinary media service with secure uploads, video chunking for large files, constraints, and DB synchronization.
- Google Gemini (google-genai) async integration to generate lesson content with strict prompt scoping.
- Docker (3.13-slim image), scripts for private server deployment (compressed/uncompressed), and GitHub release uploader for image tarballs.

## Environment

Environment is loaded via pydantic-settings with .env, using Settings() with lru_cache and validation. Required keys include:

- DATABASE_URL
- SECRET_KEY
- ACCESS_TOKEN_EXPIRE_MINUTES
- REFRESH_TOKEN_EXPIRE_MINUTES
- GEMINI_API_KEY
- GEMINI_MODEL (optional; defaults to gemini-2.5-flash)
- BACKEND_CORS_ORIGINS (JSON or CSV)
- CLOUDINARY_URL (Cloudinary SDK also pre-configured with fixed credentials block)

Note: The code currently calls cloudinary.config with explicit values in get_settings(), which will override environment values; align this with CLOUDINARY_URL for production hygiene.

## Project structure

- app/main.py: FastAPI app creation with lifespan (init_db), custom exception handlers, and CORS, registering v1 routers at docs_url="/".
- app/core: settings, security (bcrypt, Authlib JWT), environment validation.
- app/db: SQLAlchemy base, async engine/session, app startup seeding for first superuser.
- app/models: SQLAlchemy models (User, Course, Section, Lesson, Media, Project, ProjectDetail) with constraints and relationships.
- app/schemas: Pydantic v2 models for request/response, including read composites with nested relations.
- app/services: CRUD base class with async operations, domain CRUDs, media service with Cloudinary integration, AI handler orchestrating Gemini prompt and lesson updates.
- app/api/v1: Routers for auth, users, courses, sections, lessons, projects, media, and AI handler; deps include JWT extraction and role guard.
- alembic: Async migration environment, revisions establishing media table and one-to-one ties to courses/projects, and project_detail changes.
- Dockerfile: python:3.13-slim, installs requirements, exposes 8000, uvicorn run command.
- Scripts: docker_build_deploy_private.sh/.gz variant and github_release.sh with SHA256 sum and gh upload.

## Domain models

- User: UUID id, unique username/email, role enum (ADMIN/USER/MODERATOR), gender enum, bcrypt password_hash, relationships to courses.
- Course: UUID id, instructor_id (users.id), difficulty_level, is_published, one-to-one image (media), sections relation.
- Section: Autoincrement id, course_id, title, section_order with unique (course_id, section_order), lessons relation.
- Lesson: Autoincrement id, section_id, title, content, lesson_order with unique (section_id, lesson_order).
- Media: UUID id with strong constraints, unique public_id, resource_type enum (image/video), no duration for images, used as 1:1 with course/project images.
- Project: Autoincrement id, metadata, one-to-one thumbnail_image (media), ProjectDetail as 1:1.
- ProjectDetail: Autoincrement id, project_id unique, large content and tech_stack.

## API routes

Base prefix: /api/v1.

Auth

- POST /auth/login → returns access_token (cookie sets refresh_token), OAuth2PasswordRequestForm with username/password.
- POST /auth/refresh → refreshes access using refresh_token cookie.
- PATCH /auth/reset-password → requires Authorization: Bearer access token; validates username from token.
- GET /auth/me → current user details based on access token.

Users (ADMIN only)

- GET /users, GET /users/{user_id}, POST /users, PUT /users/{user_id}, DELETE /users/{user_id}.

Courses

- GET /courses → list published courses with instructor (id, name, email).
- GET /courses/{course_id} → detailed course with sections → lessons, instructor, and image.
- POST /courses (ADMIN), POST /courses/bulk (ADMIN), PUT /courses/{course_id} (ADMIN), DELETE /courses/{course_id} (ADMIN).

Sections

- GET /sections?course_id=UUID → list sections filtered by course.
- GET /sections/{section_id} → single section with lessons.
- POST /sections (ADMIN), POST /sections/bulk (ADMIN), PUT /sections/{section_id} (ADMIN), DELETE /sections/{section_id} (ADMIN).

Lessons

- GET /lessons?section_id=int → list lessons filtered by section.
- GET /lessons/{lesson_id} → single lesson.
- POST /lessons (ADMIN), POST /lessons/bulk (ADMIN), PUT /lessons/{lesson_id} (ADMIN), DELETE /lessons/{lesson_id} (ADMIN).

Projects

- GET /projects → list published projects.
- GET /projects/{project_id} → single project with thumbnail_image (media) and detail.
- POST /projects (ADMIN), POST /projects/bulk (ADMIN), PUT /projects/{project_id} (ADMIN), DELETE /projects/{project_id} (ADMIN).
- Project detail: GET /projects/{project_id}/detail; POST/PUT require ADMIN.

Media

- GET /media (ADMIN) with filters: resource_type, is_published, is_deleted, search; pagination via skip/limit; returns items + total.
- GET /media/{media_id} → public, fetch media by id.
- POST /media (ADMIN) → multipart upload to Cloudinary; validates content-type; supports large video uploads via chunking; writes to DB with constraints.
- PATCH /media/{media_id} (ADMIN) → constraint-safe update.
- DELETE /media/{media_id} (ADMIN) → deletes from Cloudinary and DB.
- POST /media/{media_id}/soft-delete (ADMIN), POST /media/{media_id}/restore (ADMIN).
- DELETE /media/{media_id}/delete-permanent (ADMIN) → Cloudinary + DB deletion with meaningful error mapping.

AI Handler (ADMIN only)

- POST /ai_handler/update_lesson?course_uid=UUID&lesson_id=int → fetches course, builds scoped prompt, calls Gemini, and updates the lesson’s content.

## Auth and security

- Password hashing with bcrypt, verification via checkpw.
- JWT tokens via Authlib JsonWebToken HS256, explicit claims include iss, aud, type metadata; decode functions return None on error.
- Access token in Authorization header; refresh token stored as HttpOnly cookie (no domain specified in code).
- Role-based access enforced via FastAPI dependency get_current_admin wrapping HTTPBearer token extraction and user lookup.

## Caching, errors, CORS

- CORS configured with dynamic BACKEND_CORS_ORIGINS from env (CSV or JSON string).
- Custom handlers for HTTPException, RequestValidationError, and fallback Exception → consistent JSON detail responses and 500 guard.
- Logs printed and exceptions logged via logging.getLogger, plus prints during dev; consider standardizing on structured logging in production.

## Database and migrations

- Engine: asyncpg, create_async_engine with pool_pre_ping, pool sizing, and async sessionmaker.
- Alembic async env with create_async_engine and run_sync to apply migrations; compare_type and compare_server_default enabled for accurate diffs.
- Revisions add media table with constraints, change courses/projects to 1:1 media relationship, and restructure project_details.
- Startup seeding: init_db ensures FIRST_SUPERUSER created when env vars present with a hashed password.

## Media pipeline

- Validates MIME types for image/video on upload.
- Automatically picks upload_large for big videos (>100MB) with configured chunk_size; otherwise uses upload().
- Enforces domain rules server-side: images cannot have duration_ms; unique public_id; soft-delete and restore supported.
- Delete flow: Cloudinary destroy followed by DB delete; error transparency for upstream failures.

## AI content pipeline

- services/ai_handler: Fetches detailed course with sections/lessons and instructor/image.
- utils/prompts: Builds a scoped prompt by lesson_id; explicitly excludes out-of-scope lessons and returns strict Markdown-only format instructions (~900–1400 words).
- utils/gemini_service: Uses google-genai client with async pathway when available; returns plain text.
- API: update_lesson endpoint handles orchestration and persists content on success, with basic error wrapping.

## Error handling and validation notes

- Pydantic schemas use Field constraints; create/update schemas are separate from read types; read types include nested MediaWithUrl and Instructor details where applicable.
- Services use a generic CRUD base with typed generics and error handling for IntegrityError and SQLAlchemyError including in bulk create, mapping to 409/500 as needed.
- Some minor code-style issues spotted (e.g., stray prints, partial ellipses in a few modules due to snippet boundaries) should be cleaned before production.

## Local development

- Requirements: Python 3.13, PostgreSQL, Cloudinary credentials, Gemini API key.
- Install: pip install -r requirements.txt.
- Environment: create .env with DATABASE_URL and JWT, Cloudinary, Gemini keys.
- Run migrations: alembic upgrade head; if no alembic_version table present, stamp head then upgrade.
- Start server: uvicorn app.main:app --host 0.0.0.0 --port 8000 (note docs served at "/").

## Docker

- Build: docker build -t ahc-backend:<version> ..
- Run: docker run -d --name ahc-backend -p 8000:8000 --env-file .env ahc-backend:<version>.
- Private deployment scripts:
  - docker_build_deploy_private.sh: builds image, replaces container, saves image to tar, scps to remote, loads, runs Alembic in a transient container, rotates old image, and starts new container.
  - docker_build_deploy_private_compressed.sh: same flow but saves compressed tar.gz using pigz, and uses ahc.env remotely for container env.
- GitHub release script github_release.sh: computes SHA256 for the tar.gz artifact and uploads with gh release upload—auto-creates release if missing.

## Configuration checklist

- Set FIRST_SUPERUSER and FIRST_SUPERUSER_PASSWORD to auto-seed admin on first startup.
- Ensure SECRET_KEY and token expiry values are set; ACCESS_TOKEN_EXPIRE_MINUTES and REFRESH_TOKEN_EXPIRE_MINUTES control session policy.
- Provide CLOUDINARY_URL (or unify cloudinary.config usage) and GEMINI_API_KEY.
- BACKEND_CORS_ORIGINS should include admin dashboard/frontend origins; supports CSV or JSON list string.

## Architecture and flow

- Request lifecycle: Request → dependency graph (DB session, token extraction, role guard) → router handler → service layer (CRUD) → DB; errors mapped to consistent JSON.
- Data access: Typed CRUDBase with list/get/create/update/delete; complex reads composed via selectinload/joinedload where needed.
- Auth: OAuth2 form login returns access token; refresh via cookie; role guard validates token claims and user existence.
- Media: HTTP upload → Cloudinary → DB write with constraints; retrieval public; updates/deletes guarded for ADMIN.
- AI: Scoped prompt generation ensures lesson-specific content; persisted on success to the lesson content field.

## Known gaps and recommendations

- Align cloudinary.config to be fully driven by environment variables (CLOUDINARY_URL) for production safety; remove hardcoded credentials.
- Consider setting secure, HttpOnly, SameSite, and domain attributes for refresh token cookie in production.
- Cleanup stray prints and enable structured logging; possibly integrate loguru already present in requirements.
- Add search, filtering, and pagination for public lists (courses/projects) as per README ideas; current implementation has a subset.
- Add 422 validation responses consistently for list filters and strengthen error messages where masked.

## Running tests

- pytest and pytest-asyncio included in requirements; test modules under tests/ to validate models, services, and endpoints it yet to be added!.