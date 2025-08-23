import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface LessonPaginationProps {
  previousLessonId: number | null;
  nextLessonId: number | null;
}

const LessonPagination: React.FC<LessonPaginationProps> = ({ previousLessonId, nextLessonId }) => {
  return (
    <div className="flex justify-between mt-8 p-4 bg-card rounded-lg shadow-md border border-border">
      {previousLessonId ? (
        <Link href={`/lessons/${previousLessonId}`} passHref>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Previous Lesson
          </Button>
        </Link>
      ) : (
        <Button variant="outline" disabled className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Previous Lesson
        </Button>
      )}

      {nextLessonId ? (
        <Link href={`/lessons/${nextLessonId}`} passHref>
          <Button variant="outline" className="flex items-center gap-2">
            Next Lesson <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      ) : (
        <Button variant="outline" disabled className="flex items-center gap-2">
          Next Lesson <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default LessonPagination;