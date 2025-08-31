"use client";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Github, ArrowLeft, Calendar, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { projectsService } from "@/services/projects";
import { slugToId } from "@/utils/slug";

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const id = parseInt(slugToId(slug) || "-1");
  console.log({ id });

  if (!id) {
    return notFound();
  }

  const {
    data: projectDetail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["project_detail_", id],
    queryFn: () => projectsService.getProject(id),
    enabled: !!id,
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
    <div className="min-h-screen py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536] mx-auto">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-xl mb-8">
            <Image
              src={
                projectDetail?.thumbnail_image?.secure_url || "/placeholder.svg"
              }
              alt={projectDetail?.title || ""}
              width={2000}
              height={633}
              className="w-full object-cover"
            />
            {/* Back Button */}
            <div className="absolute top-28 left-4 z-10">
              <Button
                asChild
                variant="outline"
                className="border-slate-600 bg-slate-800"
              >
                <Link href="/projects" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Link>
              </Button>
            </div>
            {/* <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div> */}
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(
                    String(projectDetail?.created_at) || ""
                  ).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{"Vijay Kumar"}</span>
              </div>
              <Badge className="bg-blue-600 hover:bg-blue-700">
                {/* {projectDetail?.ca} */}
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {projectDetail?.title}
              </span>
            </h1>

            <p className="text-xl text-slate-300 leading-relaxed">
              {projectDetail?.description}
            </p>

            <div className="flex flex-wrap gap-3">
              {projectDetail?.live_demo_url && (
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link
                    href={projectDetail?.live_demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View Live Site</span>
                  </Link>
                </Button>
              )}
              {projectDetail?.github_url && (
                <Button
                  asChild
                  variant="outline"
                  className="border-slate-600 hover:bg-slate-800"
                >
                  <Link
                    href={projectDetail?.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2"
                  >
                    <Github className="h-4 w-4" />
                    <span>View Source Code</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            {projectDetail?.detail?.markdown_content && (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 text-white">
                    Project Overview
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-slate-300 leading-relaxed mb-4">
                      {projectDetail?.detail?.markdown_content.split("\n\n")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {/* <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-white">
                  Project Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.gallery.map((image, index) => (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-lg"
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${project.title} screenshot ${index + 1}`}
                        width={500}
                        height={300}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Technologies */}
            {projectDetail?.technologies && (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-white">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {projectDetail.technologies?.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-slate-800 text-slate-300"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {projectDetail?.features && (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-white">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {projectDetail.features?.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-2 text-slate-300"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
