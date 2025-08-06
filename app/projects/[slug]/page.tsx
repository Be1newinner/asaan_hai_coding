import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Github, ArrowLeft, Calendar, User } from "lucide-react";

const projects = {
  "ecommerce-platform": {
    title: "E-Commerce Platform",
    description:
      "A comprehensive e-commerce solution built with Next.js 15, featuring modern design, secure payments, and advanced admin capabilities.",
    longDescription: `This full-stack e-commerce platform represents the pinnacle of modern web development, combining cutting-edge technologies with user-centric design principles. Built with Next.js 15 and the App Router, it delivers exceptional performance and SEO optimization.

The platform features a complete shopping experience with product browsing, advanced filtering, secure checkout with Stripe integration, and comprehensive order management. The admin dashboard provides powerful tools for inventory management, order processing, and analytics.

Key technical highlights include server-side rendering for optimal performance, TypeScript for type safety, Tailwind CSS for responsive design, and a robust authentication system. The application is fully responsive and optimized for both desktop and mobile experiences.`,
    image:
      "/placeholder.svg?height=400&width=800&text=E-Commerce+Platform+Hero",
    technologies: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS",
      "Stripe",
      "Prisma",
      "PostgreSQL",
    ],
    category: "Web Development",
    liveUrl: "https://example-ecommerce.vercel.app",
    githubUrl: "https://github.com/example/ecommerce-platform",
    createdAt: "2024-01-15",
    author: "ASAAN HAI CODING Team",
    gallery: [
      "/placeholder.svg?height=300&width=500&text=Homepage+Design",
      "/placeholder.svg?height=300&width=500&text=Product+Page",
      "/placeholder.svg?height=300&width=500&text=Shopping+Cart",
      "/placeholder.svg?height=300&width=500&text=Admin+Dashboard",
    ],
    features: [
      "User Authentication & Authorization",
      "Product Catalog with Advanced Filtering",
      "Shopping Cart & Wishlist",
      "Secure Payment Processing with Stripe",
      "Order Management System",
      "Admin Dashboard with Analytics",
      "Responsive Design",
      "SEO Optimized",
    ],
  },
};

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projects[params.slug as keyof typeof projects];

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            asChild
            variant="outline"
            className="border-slate-600 hover:bg-slate-800"
          >
            <Link href="/projects" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Projects</span>
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-xl mb-8">
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              width={800}
              height={400}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{project.author}</span>
              </div>
              <Badge className="bg-blue-600 hover:bg-blue-700">
                {project.category}
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {project.title}
              </span>
            </h1>

            <p className="text-xl text-slate-300 leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View Live Site</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-slate-600 hover:bg-slate-800"
              >
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <Github className="h-4 w-4" />
                  <span>View Source Code</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-white">
                  Project Overview
                </h2>
                <div className="prose prose-invert max-w-none">
                  {project.longDescription
                    .split("\n\n")
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-slate-300 leading-relaxed mb-4"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card className="bg-slate-900/50 border-slate-800">
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
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Technologies */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-white">
                  Technologies Used
                </h3>
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
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-white">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {project.features.map((feature, index) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}
