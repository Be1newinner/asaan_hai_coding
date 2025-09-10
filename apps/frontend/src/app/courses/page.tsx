import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { coursesKeys } from "@/utils/tanstack_query_keys";
import CoursesGrid from "./CoursesGrid";
import { coursesService } from "@/services/courses";

export default async function CoursesPage() {
  const query = new QueryClient();
  const LIMIT = 6;
  await query.prefetchQuery({
    queryKey: [coursesKeys.list({ page: 1, limit: LIMIT })],
    queryFn: () => coursesService.listCourses(0, LIMIT),
  });
  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Programming Courses
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Comprehensive step-by-step guides to help you master programming
              concepts, frameworks, and build amazing projects from scratch.
            </p>
          </div>

          <CoursesGrid />
        </div>
      </div>
    </HydrationBoundary>
  );
}
