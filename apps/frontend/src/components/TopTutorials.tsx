"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { coursesService } from "@/services/courses";
import { titleToSlug } from "@/utils/slug";

export default function TopTutorials() {
  const {
    data: tutorials,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tutorials"],
    queryFn: () => coursesService.listCourses(),
  });

  if (isLoading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30 text-center text-white">
        <p>Loading tutorials...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30 text-center text-red-500">
        <p>Failed to load tutorials: {error.message}</p>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Popular Tutorials
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Step-by-step guides to help you master programming concepts and
            build amazing projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {tutorials?.map((tutorial) => (
            <Card
              key={tutorial.id}
              className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all duration-300 group flex flex-col"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={tutorial.image?.secure_url || "/placeholder.svg"}
                  alt={tutorial.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-purple-600 hover:bg-purple-700">
                    {tutorial.category || "Uncategorized"}
                  </Badge>
                </div>
              </div>

              <CardHeader className="flex-auto">
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
                    <span>N/A</span>
                  </div>
                  <span>
                    {tutorial.created_at
                      ? new Date(tutorial.created_at).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

                <Button
                  asChild
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Link
                    href={`/tutorials/${titleToSlug(
                      tutorial.title,
                      tutorial.id
                    )}`}
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

        <div className="text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-slate-600 hover:bg-slate-800"
          >
            <Link href="/tutorials">View All Tutorials</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
