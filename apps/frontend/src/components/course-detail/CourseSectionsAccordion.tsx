"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CourseLessonItem from "./CourseLessonItem";
import { CourseRead } from "@/types/api";

interface CourseSectionsAccordionProps {
  course: CourseRead;
}

const CourseSectionsAccordion: React.FC<CourseSectionsAccordionProps> = ({
  course,
}) => {
  if (!course.sections || course.sections.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No sections available for this course yet.
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl sm:text-3xl font-bold mb-6 text-foreground">
        Course Curriculum
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {course.sections
          .sort((a, b) => a.section_order - b.section_order)
          .map((section) => (
            <AccordionItem
              key={section.id}
              value={`section-${section.id}`}
              className="border-b border-border"
            >
              <AccordionTrigger className="text-md sm:text-lg font-medium sm:font-semibold text-foreground hover:no-underline py-4 px-0 sm:px-6 bg-card hover:bg-muted transition-colors duration-200 rounded-t-md justify-start items-start">
                {section.section_order}. {section.title} (
                {section.lessons?.length || 0} lessons)
              </AccordionTrigger>
              <AccordionContent className="bg-background border-t border-border rounded-b-md">
                {section.lessons && section.lessons.length > 0 ? (
                  <div className="space-y-3">
                    {section.lessons
                      .sort((a, b) => a.lesson_order - b.lesson_order)
                      .map((lesson) => (
                        <CourseLessonItem key={lesson.id} lesson={lesson} />
                      ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">
                    No lessons in this section yet.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
    </div>
  );
};

export default CourseSectionsAccordion;
