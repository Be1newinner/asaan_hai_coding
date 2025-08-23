from app.services.base import CRUDBase
from app.models.lesson import Lesson
from app.schemas.lesson import LessonCreate, LessonUpdate


class LessonCrud(CRUDBase[Lesson, LessonCreate, LessonUpdate]):
    pass


lesson_crud = LessonCrud(Lesson)
