"use client";

import React from "react";
import { coursesService } from "@/services/courses";
import CourseHeroSection from "@/components/course-detail/CourseHeroSection";
import CourseSectionsAccordion from "@/components/course-detail/CourseSectionsAccordion";
import { notFound } from "next/navigation";
import { slugToId } from "@/utils/slug";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface CourseDetailPageProps {
  params: {
    slug: string;
  };
}

const CourseDetailPage: React.FC<CourseDetailPageProps> = () => {
  const params = useParams<{ slug: string }>();

  // console.log("PARAMS ", params);

  const courseId = slugToId(params.slug);

  const {
    data: course,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => {
      if (!courseId) {
        throw new Error("Course ID extraction error!");
      }
      return coursesService.getCourse(courseId);
    },
    enabled: !!courseId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-400">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error(`Failed to fetch course with ID ${courseId}:`, error);
    notFound();
  }

  if (!course) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <CourseHeroSection course={course} />
      <CourseSectionsAccordion course={course} />
    </div>
  );
};

export default CourseDetailPage;
