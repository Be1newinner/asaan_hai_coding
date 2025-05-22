import type { BlogPost } from "@/components/blog-card"

// Mock data for blogs
export const blogs: BlogPost[] = [
  {
    id: "1",
    slug: "getting-started-with-nextjs",
    title: "Getting Started with Next.js: A Comprehensive Guide",
    excerpt: "Learn how to build modern web applications with Next.js, from setup to deployment.",
    category: "Frontend",
    date: "May 15, 2023",
    thumbnail: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "2",
    slug: "mastering-react-hooks",
    title: "Mastering React Hooks: Beyond the Basics",
    excerpt: "Take your React skills to the next level by mastering hooks and custom hook patterns.",
    category: "Frontend",
    date: "June 2, 2023",
    thumbnail: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "3",
    slug: "nodejs-api-development",
    title: "Building Robust APIs with Node.js and Express",
    excerpt: "A step-by-step guide to creating scalable and secure REST APIs with Node.js.",
    category: "Backend",
    date: "June 20, 2023",
    thumbnail: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "4",
    slug: "docker-for-developers",
    title: "Docker for Developers: Simplifying Development Environments",
    excerpt: "Learn how to use Docker to create consistent development environments across your team.",
    category: "DevOps",
    date: "July 5, 2023",
    thumbnail: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "5",
    slug: "typescript-best-practices",
    title: "TypeScript Best Practices for Large-Scale Applications",
    excerpt: "Discover patterns and practices to maintain large TypeScript codebases effectively.",
    category: "Frontend",
    date: "July 18, 2023",
    thumbnail: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "6",
    slug: "fastapi-python-backend",
    title: "Building High-Performance APIs with FastAPI",
    excerpt: "Explore how to create fast, modern APIs with Python's FastAPI framework.",
    category: "Backend",
    date: "August 3, 2023",
    thumbnail: "/placeholder.svg?height=400&width=600",
  },
]

// Get all blog posts
export const getAllBlogs = () => {
  return blogs
}

// Get blog post by slug
export const getBlogBySlug = (slug: string) => {
  return blogs.find((blog) => blog.slug === slug)
}

// Get blogs by category
export const getBlogsByCategory = (category: string) => {
  return blogs.filter((blog) => blog.category.toLowerCase() === category.toLowerCase())
}

// Get all categories with count
export const getAllCategories = () => {
  const categories = blogs.map((blog) => blog.category)
  const uniqueCategories = [...new Set(categories)]

  return uniqueCategories.map((category) => ({
    name: category,
    count: blogs.filter((blog) => blog.category === category).length,
    slug: category.toLowerCase(),
  }))
}

// Mock data for open source projects
export const openSourceProjects = [
  {
    id: "1",
    slug: "react-component-library",
    title: "React Component Library",
    description: "A collection of reusable React components with TypeScript support.",
    githubUrl: "https://github.com/username/react-component-library",
    techStack: ["React", "TypeScript", "Storybook"],
  },
  {
    id: "2",
    slug: "node-api-boilerplate",
    title: "Node.js API Boilerplate",
    description: "A production-ready Node.js API boilerplate with Express, MongoDB, and JWT authentication.",
    githubUrl: "https://github.com/username/node-api-boilerplate",
    techStack: ["Node.js", "Express", "MongoDB"],
  },
  {
    id: "3",
    slug: "python-data-utils",
    title: "Python Data Utilities",
    description: "A collection of Python utilities for data processing and analysis.",
    githubUrl: "https://github.com/username/python-data-utils",
    techStack: ["Python", "Pandas", "NumPy"],
  },
]

// Get all open source projects
export const getAllProjects = () => {
  return openSourceProjects
}

// Get project by slug
export const getProjectBySlug = (slug: string) => {
  return openSourceProjects.find((project) => project.slug === slug)
}
