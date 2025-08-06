import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const tutorials = [
  {
    id: 1,
    title: "Complete Next.js 15 Guide",
    description:
      "Learn Next.js 15 from scratch with App Router, Server Components, and modern React patterns. Build production-ready applications.",
    image: "/placeholder.svg?height=200&width=300&text=Next.js+15+Guide",
    category: "Web Development",
    readTime: "45 min",
    publishedAt: "2024-01-15",
    slug: "complete-nextjs-15-guide",
  },
  {
    id: 2,
    title: "Python for Beginners",
    description:
      "Start your programming journey with Python. Learn syntax, data structures, and build real projects step by step.",
    image: "/placeholder.svg?height=200&width=300&text=Python+for+Beginners",
    category: "Programming",
    readTime: "60 min",
    publishedAt: "2024-01-10",
    slug: "python-for-beginners",
  },
  {
    id: 3,
    title: "React Native Mobile Apps",
    description:
      "Build cross-platform mobile applications using React Native and modern development tools and best practices.",
    image: "/placeholder.svg?height=200&width=300&text=React+Native+Apps",
    category: "Mobile Development",
    readTime: "90 min",
    publishedAt: "2024-01-05",
    slug: "react-native-mobile-apps",
  },
  {
    id: 4,
    title: "TypeScript Fundamentals",
    description:
      "Master TypeScript from basics to advanced concepts. Learn type safety, interfaces, generics, and more.",
    image: "/placeholder.svg?height=200&width=300&text=TypeScript+Fundamentals",
    category: "Programming",
    readTime: "75 min",
    publishedAt: "2024-01-01",
    slug: "typescript-fundamentals",
  },
  {
    id: 5,
    title: "Tailwind CSS Mastery",
    description:
      "Learn utility-first CSS with Tailwind. Create beautiful, responsive designs with modern CSS techniques.",
    image: "/placeholder.svg?height=200&width=300&text=Tailwind+CSS+Mastery",
    category: "Frontend",
    readTime: "50 min",
    publishedAt: "2023-12-28",
    slug: "tailwind-css-mastery",
  },
  {
    id: 6,
    title: "Node.js Backend Development",
    description:
      "Build scalable backend applications with Node.js, Express, and modern JavaScript patterns.",
    image: "/placeholder.svg?height=200&width=300&text=Node.js+Backend",
    category: "Backend",
    readTime: "120 min",
    publishedAt: "2023-12-25",
    slug: "nodejs-backend-development",
  },
];

export default function TutorialsPage() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Programming Tutorials
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Comprehensive step-by-step guides to help you master programming
            concepts, frameworks, and build amazing projects from scratch.
          </p>
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutorials.map((tutorial) => (
            <Card
              key={tutorial.id}
              className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all duration-300 group"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={tutorial.image || "/placeholder.svg"}
                  alt={tutorial.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-purple-600 hover:bg-purple-700">
                    {tutorial.category}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-white group-hover:text-purple-400 transition-colors">
                  {tutorial.title}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {tutorial.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{tutorial.readTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(tutorial.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Link
                    href={`/tutorials/${tutorial.slug}`}
                    className="flex items-center justify-center space-x-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Read Tutorial</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
