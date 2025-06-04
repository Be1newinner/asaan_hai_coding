import { getProjectBySlug, getAllProjects } from "@/lib/api"
import Link from "next/link"
import { Github, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import MarkdownContent from "@/components/markdown-content"
import { notFound } from "next/navigation"

// Sample markdown content for the project
const sampleProjectMarkdown = `
# React Component Library

A collection of reusable React components with TypeScript support.

## Features

- Fully typed components with TypeScript
- Storybook integration for component documentation
- Comprehensive test coverage with Jest and React Testing Library
- Themeable components with CSS variables
- Tree-shakeable exports

## Installation

\`\`\`bash
npm install @username/react-component-library
\`\`\`

## Usage

\`\`\`jsx
import { Button, Card } from '@username/react-component-library';

function App() {
  return (
    <Card>
      <Card.Header>Hello World</Card.Header>
      <Card.Body>
        This is a sample card component from our library.
      </Card.Body>
      <Card.Footer>
        <Button variant="primary">Click Me</Button>
      </Card.Footer>
    </Card>
  );
}
\`\`\`

## Available Components

- Button
- Card
- Input
- Modal
- Dropdown
- Tabs
- Toast
- Tooltip

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
`

export function generateStaticParams() {
  const projects = getAllProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/open-source">
            <Button variant="ghost" size="sm" className="mb-4">
              <ChevronLeft className="mr-1 h-4 w-4" /> All Projects
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0">{project.title}</h1>

            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <Github className="mr-2 h-5 w-5" />
              View on GitHub
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="outline" className="bg-gray-800 border-gray-700">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          <MarkdownContent content={sampleProjectMarkdown} />
        </div>
      </article>
    </div>
  )
}
