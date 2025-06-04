"use client"

import { getBlogBySlug, getAllBlogs } from "@/lib/api"
import Image from "next/image"
import { notFound } from "next/navigation"
import { m } from "framer-motion"
import { Calendar, Share2 } from "lucide-react"
import MarkdownContent from "@/components/markdown-content"
import TableOfContents from "@/components/table-of-contents"
import BlogCard from "@/components/blog-card"
import ScrollProgress from "@/components/scroll-progress"

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

export default function BlogPageClient({ params }: { params: { slug: string } }) {
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
    <>
      <ScrollProgress />
      <div className="container mx-auto px-4 py-8 pt-24">
        <article className="max-w-4xl mx-auto">
          <m.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-8 group">
              <Image
                src={blog.thumbnail || "/placeholder.svg"}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
            </div>

            <m.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
            >
              {blog.title}
            </m.h1>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center text-gray-400 mb-8"
            >
              <div className="flex items-center mr-6">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">{blog.date}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
                  {blog.category}
                </span>
              </div>
            </m.div>
          </m.div>

          <div className="lg:grid lg:grid-cols-4 gap-8">
            <m.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="lg:col-span-3"
            >
              <MarkdownContent content={sampleMarkdown} />

              <m.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-12 pt-8 border-t border-gray-800/50"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Share this article</h3>
                  <m.button
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-purple-400 transition-colors p-2 rounded-full bg-gray-800/50 backdrop-blur-sm"
                  >
                    <Share2 className="h-5 w-5" />
                  </m.button>
                </div>
              </m.div>
            </m.div>

            <m.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="hidden lg:block"
            >
              <div className="sticky top-32">
                <TableOfContents />
              </div>
            </m.div>
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <m.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto mt-20 pt-12 border-t border-gray-800/50"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>
          </m.section>
        )}
      </div>
    </>
  )
}
