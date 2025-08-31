"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { projectsService } from "@/services/projects";
import { titleToSlug } from "@/utils/slug";

// const featuredProjects = [
//   {
//     id: 1,
//     title: "E-Commerce Platform",
//     description:
//       "A full-stack e-commerce solution built with Next.js, featuring user authentication, payment integration, and admin dashboard.",
//     image: "/placeholder.svg?height=200&width=300&text=E-Commerce+Platform",
//     technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe"],
//     liveUrl: "#",
//     githubUrl: "#",
//     slug: "ecommerce-platform",
//   },
//   {
//     id: 2,
//     title: "Task Management App",
//     description:
//       "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
//     image: "/placeholder.svg?height=200&width=300&text=Task+Management+App",
//     technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
//     liveUrl: "#",
//     githubUrl: "#",
//     slug: "task-management-app",
//   },
//   {
//     id: 3,
//     title: "Weather Dashboard",
//     description:
//       "A beautiful weather dashboard with location-based forecasts, interactive maps, and detailed weather analytics.",
//     image: "/placeholder.svg?height=200&width=300&text=Weather+Dashboard",
//     technologies: ["Vue.js", "Python", "FastAPI", "Chart.js"],
//     liveUrl: "#",
//     githubUrl: "#",
//     slug: "weather-dashboard",
//   },
// ];

export default function TopProjects() {
  const {
    data: topProjects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["featuredProjects"],
    queryFn: () => projectsService.listProjects(),
  });

  console.log(topProjects);

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
          {topProjects?.map((project) => (
            <Card
              key={project.id}
              className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all duration-300 group"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={
                    project.thumbnail_image?.secure_url || "/placeholder.svg"
                  }
                  alt={project.title}
                  width={900}
                  height={600}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <CardHeader>
                <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="bg-slate-800 text-slate-300"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div> */}

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 hover:bg-slate-800"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Live
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 hover:bg-slate-800"
                    >
                      <Github className="h-4 w-4 mr-1" />
                      Code
                    </Button>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Link
                      href={`/projects/${titleToSlug(project.title, project.id)}`}
                    >
                      Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
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
