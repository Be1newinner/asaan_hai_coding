"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { projectsService } from "@/services/projects";
import SingleProject from "./projects/SingleProject";
import TANSTACK_QUERY_KEYS from "@/utils/tanstack_query_keys";

export default function TopProjects() {
  const {
    data: topProjects,
    isLoading,
    error,
  } = useQuery({
    queryKey: [TANSTACK_QUERY_KEYS.TOP_PROJECTS_HOME],
    queryFn: () => projectsService.listProjects({ limit: 3 }),
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
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Explore our latest and most innovative projects showcasing modern
            web development techniques
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {topProjects?.items?.map((project) => (
            <SingleProject key={project.id} project={project} />
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-slate-600 hover:bg-slate-800"
          >
            <Link href="/projects">View All Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
