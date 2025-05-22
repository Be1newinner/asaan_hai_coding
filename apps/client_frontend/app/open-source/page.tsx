import { getAllProjects } from "@/lib/api"
import Link from "next/link"
import { Github, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function OpenSourcePage() {
  const projects = getAllProjects()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Open Source Contributions</h1>
        <p className="text-gray-400 mb-8">
          Explore my open source projects and contributions. I believe in giving back to the community and sharing
          knowledge through code.
        </p>

        <div className="grid gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
                <p className="text-gray-400 mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="bg-gray-800 text-gray-300">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
                <Link
                  href={`/open-source/${project.slug}`}
                  className="text-purple-400 hover:text-purple-300 flex items-center"
                >
                  <span>View Details</span>
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Link>

                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white flex items-center"
                >
                  <Github className="mr-1 h-4 w-4" />
                  <span>GitHub</span>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
