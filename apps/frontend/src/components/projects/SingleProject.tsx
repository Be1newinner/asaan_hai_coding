import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { titleToSlug } from "@/utils/slug";
import { ProjectRead } from "@/types/api";
import { Badge } from "../ui/badge";

export default function SingleProject({ project }: { project: ProjectRead }) {
  return (
    <Card
      key={project.id}
      className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all duration-300 group  flex flex-col"
    >
      <Link href={`/projects/${titleToSlug(project.title, project.id)}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={project.thumbnail_image?.secure_url || "/placeholder.svg"}
            alt={project.title}
            width={900}
            height={600}
            className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>

      <Link
        href={`/projects/${titleToSlug(project.title, project.id)}`}
        className="flex-auto"
      >
        <CardHeader>
          <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
            {project.title}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {project.description}
          </CardDescription>
        </CardHeader>
      </Link>

      <CardContent className="space-y-4 flex flex-col justify-end">
        <div className="flex flex-wrap gap-2">
          {project?.technologies?.map((tech) => (
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
            {project.live_demo_url ? (
              <Link href={project.live_demo_url}>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-600 hover:bg-slate-800"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Live
                </Button>
              </Link>
            ) : null}
            {project.github_url ? (
              <Link href={project.github_url}>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-600 hover:bg-slate-800"
                >
                  <Github className="h-4 w-4 mr-1" />
                  Code
                </Button>
              </Link>
            ) : null}
          </div>
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Link href={`/projects/${titleToSlug(project.title, project.id)}`}>
              Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
