"use client";
import React from "react";
import { lessonsService } from "@/services/lessons";
import LessonHeroSection from "@/components/lesson-detail/LessonHeroSection";
import LessonContent from "@/components/lesson-detail/LessonContent";
import LessonPagination from "@/components/lesson-detail/LessonPagination";
import { notFound, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

interface LessonDetailPageProps {
  params: {
    slug: string;
  };
}

const LessonDetailPage: React.FC<LessonDetailPageProps> = () => {
  const params = useParams<{ slug: string }>();

  const lessonId = parseInt(params.slug, 10);

  if (isNaN(lessonId)) {
    notFound();
  }

  const {
    data: lesson,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => lessonsService.getLesson(lessonId),
    enabled: !isNaN(lessonId),
  });

  const courseTitle: string | undefined = undefined;
  const sectionTitle: string | undefined = undefined;
  const previousLessonId: number | null = null;
  const nextLessonId: number | null = null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-400">Loading lesson details...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
