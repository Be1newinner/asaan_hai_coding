import Image from "next/image";
import React from "react";
import { LessonRead } from "@/types/api";

interface LessonHeroSectionProps {
  lesson: LessonRead;
  courseTitle?: string;
  sectionTitle?: string;
}

const LessonHeroSection: React.FC<LessonHeroSectionProps> = ({
  lesson,
  courseTitle,
  sectionTitle,
}) => {
  const imageUrl = "/placeholder.jpg";
  return (
    <section className="relative w-full h-72 md:h-80 overflow-hidden rounded-lg shadow-lg mb-8">
      <Image
        src={imageUrl}
        alt={lesson.title}
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0 opacity-50"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10 flex items-end p-6 md:p-8">
        <div className="text-foreground max-w-3xl">
          {courseTitle && (
            <p className="text-sm md:text-base text-muted-foreground mb-1">
              Course: {courseTitle}
            </p>
          )}
          {sectionTitle && (
            <p className="text-sm md:text-base text-muted-foreground mb-2">
              Section: {sectionTitle}
            </p>
          )}
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 leading-tight">
            {lesson.title}
          </h1>
          <p className="text-md md:text-lg opacity-90 text-muted-foreground">
            Lesson {lesson.lesson_order}
          </p>
        </div>
      </div>
    </section>
  );
};

export default LessonHeroSection;
