"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Filter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const categories = [
  "All",
  "Web Development",
  "Mobile App",
  "Python",
  "Next.js",
  "Frontend",
  "Backend",
];

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce solution built with Next.js, featuring user authentication, payment integration, and admin dashboard.",
    image: "/placeholder.svg?height=200&width=300&text=E-Commerce+Platform",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe"],
    category: "Web Development",
    liveUrl: "#",
    githubUrl: "#",
    slug: "ecommerce-platform",
  },
  {
    id: 2,
    title: "Task Management App",
    description:
      "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
    image: "/placeholder.svg?height=200&width=300&text=Task+Management+App",
    technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
    category: "Web Development",
    liveUrl: "#",
    githubUrl: "#",
    slug: "task-management-app",
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description:
      "A beautiful weather dashboard with location-based forecasts, interactive maps, and detailed weather analytics.",
    image: "/placeholder.svg?height=200&width=300&text=Weather+Dashboard",
    technologies: ["Vue.js", "Python", "FastAPI", "Chart.js"],
    category: "Python",
    liveUrl: "#",
    githubUrl: "#",
    slug: "weather-dashboard",
  },
  {
    id: 4,
    title: "Mobile Banking App",
    description:
      "A secure mobile banking application with biometric authentication, transaction history, and budget tracking.",
    image: "/placeholder.svg?height=200&width=300&text=Mobile+Banking+App",
    technologies: ["React Native", "TypeScript", "Firebase", "Expo"],
    category: "Mobile App",
    liveUrl: "#",
    githubUrl: "#",
    slug: "mobile-banking-app",
  },
  {
    id: 5,
    title: "Portfolio Website",
    description:
      "A modern, responsive portfolio website showcasing projects and skills with smooth animations and dark mode support.",
    image: "/placeholder.svg?height=200&width=300&text=Portfolio+Website",
    technologies: ["Next.js", "Framer Motion", "Tailwind CSS"],
    category: "Frontend",
    liveUrl: "#",
    githubUrl: "#",
    slug: "portfolio-website",
  },
  {
    id: 6,
    title: "API Gateway Service",
    description:
      "A scalable API gateway service with rate limiting, authentication, and request/response transformation capabilities.",
    image: "/placeholder.svg?height=200&width=300&text=API+Gateway+Service",
    technologies: ["Node.js", "Express", "Redis", "Docker"],
    category: "Backend",
    liveUrl: "#",
    githubUrl: "#",
    slug: "api-gateway-service",
  },
];

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
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
            development, mobile apps, and innovative solutions built with modern
            technologies.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-12">
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
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all duration-300 group"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-600 hover:bg-blue-700">
                    {project.category}
                  </Badge>
                </div>
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
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="bg-slate-800 text-slate-300"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>

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
                    <Link href={`/projects/${project.slug}`}>Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-slate-400">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
