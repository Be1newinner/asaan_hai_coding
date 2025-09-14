import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { LessonRead } from "@/types/api";
import Link from "next/link";

interface CourseLessonItemProps {
  lesson: LessonRead;
}

const CourseLessonItem: React.FC<CourseLessonItemProps> = ({ lesson }) => {
  return (
    <Link href={`/lessons/${lesson.id}`} passHref>
      <Card className="mb-2 shadow-sm hover:shadow-md transition-shadow duration-200 bg-card text-card-foreground border-border">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center flex-grow min-w-0">
            {" "}
            <BookOpen className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
            <div className="flex-grow min-w-0">
              {" "}
              <h4 className="font-medium text-xs sm:text-base text-foreground truncate">
                {lesson.title}
              </h4>{" "}
            </div>
          </div>
          <div className="border rounded-lg hidden sm:inline">
            <Button variant="secondary" className="flex-shrink-0">
              View Lesson
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseLessonItem;
