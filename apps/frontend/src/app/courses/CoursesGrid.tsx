"use client";

import { PaginationDark } from "@/components/Pagination";
import SingleCourse from "@/components/SingleCourse";
import { coursesService } from "@/services/courses";
import { coursesKeys } from "@/utils/tanstack_query_keys";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function CoursesGrid() {
  const searchParams = useSearchParams();

  //   const limit = searchParams.get("limit") || 6;
  const PAGE = Number(searchParams.get("page")) || 1;
  const LIMIT = 6;

  const {
    data: courses,
    isLoading,
    error,
  } = useQuery({
    queryKey: [coursesKeys.list({ page: PAGE, limit: LIMIT })],
    queryFn: () => coursesService.listCourses(LIMIT * (PAGE - 1), LIMIT),
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    staleTime: 6 * 60 * 60 * 1000,
  });

  const TOTAL = Number(courses?.total || 0) / LIMIT;

  if (isLoading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30 text-center text-white">
        <p>Loading courses...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30 text-center text-red-500">
        <p>Failed to load courses: {error.message}</p>
      </section>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses?.items?.map((course) => (
          <SingleCourse course={course} key={course.id} />
        ))}
      </div>

      {/* {courses?.items?.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-slate-400">
            No course found in this category.
          </p>
        </div>
      )} */}

      <PaginationDark
        totalPages={TOTAL}
        currentPage={Number(PAGE)}
        makeHref={(p) => `/courses?page=${p}`}
      />
    </>
  );
}
