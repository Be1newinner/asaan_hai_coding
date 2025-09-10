"use client";

import { PaginationDark } from "@/components/Pagination";
import SingleProject from "@/components/projects/SingleProject";
import { projectsService } from "@/services/projects";
import { projectKeys } from "@/utils/tanstack_query_keys";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function ProjectsGrid() {
  const searchParams = useSearchParams();

  //   const limit = searchParams.get("limit") || 6;
  const page = searchParams.get("page") || 1;

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: [projectKeys.list({ page, limit: 6 })],
    queryFn: () => projectsService.listProjects({ limit: 6 }),
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    staleTime: 6 * 60 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30 text-center text-white">
        <p>Loading projects...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30 text-center text-red-500">
        <p>Failed to load projects: {error.message}</p>
      </section>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects?.map((project) => (
          <SingleProject key={project.id} project={project} />
        ))}
      </div>

      {/* PROJECT NOT FOUND PLACEHOLDER, I WILL UPDATE THIS LATER! */}

      {projects?.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-slate-400">
            No projects found in this category.
          </p>
        </div>
      )}

      <PaginationDark
        totalPages={3}
        currentPage={Number(page)}
        makeHref={(p) => `/projects?page=${p}`}
      />
    </>
  );
}
