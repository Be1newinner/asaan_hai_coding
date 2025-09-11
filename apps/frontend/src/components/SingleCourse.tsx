import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen } from "lucide-react";
import Image from "next/image";
import { titleToSlug } from "@/utils/slug";
import { Button } from "./ui/button";
import { CourseReadBase } from "@/types/api";
import Link from "next/link";

export default function SingleCourse({ course }: { course: CourseReadBase }) {
  return (
    <Link
      href={`/courses/${titleToSlug(course.title, course.id)}`}
      className="flex flex-col"
    >
      <Card
        key={course.id}
        className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all duration-300 group flex flex-col flex-auto"
      >
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={course.image?.secure_url || "/placeholder.svg"}
            alt={course.title}
            width={300}
            height={200}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-purple-600 hover:bg-purple-700">
              {course.category || "Uncategorized"}
            </Badge>
          </div>
        </div>

        <CardHeader className="flex-auto">
          <CardTitle className="text-white group-hover:text-purple-400 transition-colors">
            {course.title}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {course.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>N/A</span>
            </div>
            <span>
              {course.created_at
                ? new Date(course.created_at).toLocaleDateString()
                : "N/A"}
            </span>
          </div>

          <Button className="w-full bg-purple-600 hover:bg-purple-700">
            <BookOpen size={24} />
            Read More
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
