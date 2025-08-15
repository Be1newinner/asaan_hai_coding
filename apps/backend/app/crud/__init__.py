from .course import course_crud
from .section import section_crud
from .lesson import lesson_crud
from .project import project_crud, project_detail_crud
from .user import user_crud

__all__ = [
    "course_crud",
    "section_crud",
    "lesson_crud",
    "project_crud",
    "project_detail_crud",
    "user_crud",
]
