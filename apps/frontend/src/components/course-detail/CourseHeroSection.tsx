import Image from "next/image";
import React from "react";
import { CourseRead } from "@/types/api";

interface CourseHeroSectionProps {
  course: CourseRead;
}

const CourseHeroSection: React.FC<CourseHeroSectionProps> = ({ course }) => {
  // const imageUrl = "/placeholder.jpg";

  return (
    <section className="relative w-full h-96 overflow-hidden rounded-lg shadow-lg mb-8 text-black bg-slate-300">
      {/* <Image
        src={imageUrl}
        alt={course.title}
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0"
        priority
      /> */}
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 flex items-end p-8">
        <div className="text-foreground max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 leading-tight">
            {course.title}
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-4 text-muted-foreground">
            {course.description}
          </p>
          <div className="flex flex-wrap gap-4 text-sm md:text-base">
            {course.difficulty_level && (
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold">
                {course.difficulty_level}
              </span>
            )}
            {course.instructor_id && (
              <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full font-semibold">
                Instructor: {course.instructor_id.substring(0, 8)}...
              </span>
            )}
            {course.is_published && (
              <span className="bg-green-600 text-white px-3 py-1 rounded-full font-semibold">
                Published
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseHeroSection;
