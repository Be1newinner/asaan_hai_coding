import { getBlogBySlug, getAllBlogs } from "@/lib/api"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Calendar, Share2 } from "lucide-react"
import MarkdownContent from "@/components/markdown-content"
import TableOfContents from "@/components/table-of-contents"
import BlogCard from "@/components/blog-card"

// Sample markdown content for the blog post
const sampleMarkdown = `
# Getting Started with Next.js

Next.js is a React framework that enables server-side rendering and static site generation for React applications.

## Why Next.js?

Next.js provides a number of benefits:

- **Server-side rendering**: Improves performance and SEO
- **Static site generation**: Pre-renders pages at build time
- **API routes**: Create API endpoints as part of your Next.js app
- **File-based routing**: Create routes based on the file system

## Setting Up a Next.js Project

To create a new Next.js project, run:

\`\`\`bash
npx create-next-app my-next-app
cd my-next-app
npm run dev
\`\`\`

## Creating Pages

In Next.js, a page is a React Component exported from a file in the \`pages\` directory.

\`\`\`jsx
// pages/index.js
export default function Home() {
  return (
    <div>
      <h1>Welcome to my Next.js site!</h1>
    </div>
  )
}
\`\`\`

## Data Fetching

Next.js has two forms of pre-rendering: Static Generation and Server-side Rendering.

### Static Generation

\`\`\`jsx
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()

  return {
    props: {
      data,
    },
  }
}
\`\`\`

### Server-side Rendering

\`\`\`jsx
export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()

  return {
    props: {
      data,
    },
  }
}
\`\`\`

## Conclusion

Next.js makes it easy to build high-performance React applications with server-side rendering and static site generation.
`

export function generateStaticParams() {
  const blogs = getAllBlogs()
  return blogs.map((blog) => ({
    slug: blog.slug,
  }))
}

export default function BlogPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const blog = getBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  // Get related posts (same category, excluding current post)
  const relatedPosts = getAllBlogs()
    .filter((post) => post.category === blog.category && post.id !== blog.id)
    .slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-6">
            <Image src={blog.thumbnail || "/placeholder.svg"} alt={blog.title} fill className="object-cover" priority />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>

          <div className="flex items-center text-gray-400 mb-8">
            <div className="flex items-center mr-6">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">{blog.date}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm bg-purple-900/30 text-purple-300 px-2 py-1 rounded">{blog.category}</span>
            </div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <MarkdownContent content={sampleMarkdown} />

            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Share this article</h3>
                <div className="flex space-x-4">
                  <button className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents />
            </div>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto mt-16 pt-8 border-t border-gray-800">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
