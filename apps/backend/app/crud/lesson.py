from app.crud.base import CRUDBase
from app.models.lesson import Lesson
from app.schemas.lesson import LessonCreate, LessonUpdate

lesson_crud = CRUDBase[Lesson, LessonCreate, LessonUpdate](Lesson)
