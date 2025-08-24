import React from "react";
import { lessonsService } from "@/services/lessons";
// import { coursesService } from "@/services/courses";
import LessonHeroSection from "@/components/lesson-detail/LessonHeroSection";
import LessonContent from "@/components/lesson-detail/LessonContent";
import LessonPagination from "@/components/lesson-detail/LessonPagination";
import { notFound } from "next/navigation";
import { LessonRead } from "@/types/api";

interface LessonDetailPageProps {
  params: {
    slug: string;
  };
}

const LessonDetailPage: React.FC<LessonDetailPageProps> = async ({
  params,
}) => {
  const param_id = await params;
  console.log(param_id);
  const lessonId = parseInt(param_id.slug, 10);
  if (isNaN(lessonId)) {
    notFound();
  }

  console.log({ lessonId });

  let lesson: LessonRead | null = null;
  let courseTitle: string | undefined;
  let sectionTitle: string | undefined;
  const previousLessonId: number | null = null;
  const nextLessonId: number | null = null;

  try {
    lesson = await lessonsService.getLesson(lessonId);
    console.log({ lesson });
    if (!lesson) {
      notFound();
    }
  } catch (error) {
    console.error(`Failed to fetch lesson with ID ${lessonId}:`, error);
    notFound();
  }

  if (!lesson) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <LessonHeroSection
        lesson={lesson}
        courseTitle={courseTitle}
        sectionTitle={sectionTitle}
      />
      <LessonContent content={lesson.content} />
      <LessonPagination
        previousLessonId={previousLessonId}
        nextLessonId={nextLessonId}
      />
    </div>
  );
};

export default LessonDetailPage;
