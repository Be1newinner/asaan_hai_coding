// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Filter } from "lucide-react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ProjectsGrid from "./ProjectsGrid";
import { projectKeys } from "@/utils/tanstack_query_keys";
import { projectsService } from "@/services/projects";

// const categories = [
//   "All",
//   "Web Development",
//   "Mobile App",
//   "Python",
//   "Next.js",
//   "Frontend",
//   "Backend",
// ];

export default async function ProjectsPage() {
  // const [selectedCategory, setSelectedCategory] = useState("All");

  const query = new QueryClient();
  await query.prefetchQuery({
    queryKey: [projectKeys.list({ page: 1, limit: 6 })],
    queryFn: () => projectsService.listProjects({ limit: 3 }),
  });

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Our Projects
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Explore our comprehensive collection of projects spanning web
              development, mobile apps, and innovative solutions built with
              modern technologies.
            </p>
          </div>

          {/* Filter Bar */}
          {/* <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <Filter className="h-5 w-5 text-slate-400 mr-2" />
            <span className="text-slate-400 font-medium">
              Filter by category:
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "border-slate-600 hover:bg-slate-800"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div> */}

          <ProjectsGrid />
        </div>
      </div>
    </HydrationBoundary>
  );
}
