import React from "react";
import { CourseRead } from "@/types/api";

interface CourseHeroSectionProps {
  course: CourseRead;
}

const CourseHeroSection: React.FC<CourseHeroSectionProps> = ({ course }) => {
  return (
    <section className="w-full overflow-hidden rounded-lg shadow-lg mb-8 text-black bg-slate-300">
      <div className="flex flex-col items-start p-6 sm:p-8">
        <div className="text-foreground">
          <h1 className="text-xl md:text-5xl font-bold sm:font-extrabold mb-2 leading-tight">
            {course.title}
          </h1>
          <p className="text-sm md:text-xl opacity-90 mb-4 text-muted-foreground text-justify hidden sm:flex">
            {course.description}
          </p>
          <p className="text-sm md:text-xl opacity-90 mb-4 text-muted-foreground text-justify flex sm:hidden">
            {course.description.slice(0, 250)}.....
          </p>
          <div className="flex flex-wrap gap-4 text-sm md:text-base justify-between">
            {course.difficulty_level && (
              <span className="bg-primary text-primary-foreground py-1 rounded-full font-semibold">
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
