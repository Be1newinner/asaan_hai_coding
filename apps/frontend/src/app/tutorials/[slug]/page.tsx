import React from "react";
import { coursesService } from "@/services/courses";
import CourseHeroSection from "@/components/course-detail/CourseHeroSection";
import CourseSectionsAccordion from "@/components/course-detail/CourseSectionsAccordion";
import { notFound } from "next/navigation";
import { slugToId } from "@/utils/slug";

interface CourseDetailPageProps {
  params: {
    slug: string;
  };
}

const CourseDetailPage: React.FC<CourseDetailPageProps> = async ({
  params,
}) => {
  const slug_param = await params;
  const courseId = slugToId(slug_param.slug);

  console.log(courseId);

  let course;

  try {
    if (!courseId) throw Error("Course ID extraction error!");
    course = await coursesService.getCourse(courseId);
  } catch (error) {
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
