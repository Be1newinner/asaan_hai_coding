"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { coursesService } from "@/services/courses";
import { coursesKeys } from "@/utils/tanstack_query_keys";
import SingleCourse from "./SingleCourse";

export default function TopCourses() {
  const {
    data: courses,
    isLoading,
    error,
  } = useQuery({
    queryKey: [coursesKeys.list({ page: 1, limit: 4 })],
    queryFn: () => coursesService.listCourses(0, 4),
  });

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
    <section className="px-4 py-12 sm:px-6 lg:px-8 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Popular Courses
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Step-by-step guides to help you master programming concepts and
            build amazing projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {courses?.map((course) => (
            <SingleCourse course={course} key={course.id} />
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-slate-600 hover:bg-slate-800"
          >
            <Link href="/courses">View All Courses</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
