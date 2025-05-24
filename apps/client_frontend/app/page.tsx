"use client"

import ParallaxHero from "@/components/parallax-hero"
import BlogCard from "@/components/blog-card"
import { getAllBlogs, getAllCategories } from "@/lib/api"
import Link from "next/link"
import { m } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, Code, Database, Server } from "lucide-react"

const categoryIcons: Record<string, any> = {
  Frontend: Code,
  Backend: Server,
  DevOps: Database,
}

export default function Home() {
  const blogs = getAllBlogs()
  const categories = getAllCategories()

  return (
    <div className="min-h-screen">
      <ParallaxHero />

      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <m.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-between items-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Latest Blogs
            </h2>
            <Link href="/categories">
              <Button variant="ghost" className="text-purple-400 hover:text-purple-300 group">
                View All
                <m.div className="ml-2" whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <ChevronRight className="h-4 w-4" />
                </m.div>
              </Button>
            </Link>
          </m.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.slice(0, 6).map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-gray-900/50 to-gray-950 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <m.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
          >
            Explore Categories
          </m.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const IconComponent = categoryIcons[category.name] || Code
              return (
                <m.div
                  key={category.name}
                  initial={{ opacity: 0, y: 50, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{
                    y: -10,
                    rotateX: 5,
                    boxShadow: "0 20px 40px rgba(168, 85, 247, 0.2)",
                  }}
                  className="perspective-1000"
                >
                  <Link
                    href={`/category/${category.slug}`}
                    className="block bg-gray-800/60 backdrop-blur-md hover:bg-gray-700/60 border border-gray-700/50 hover:border-purple-500/50 rounded-xl p-8 transition-all duration-500 group"
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg mr-4 group-hover:from-purple-600/30 group-hover:to-pink-600/30 transition-all duration-300">
                        <IconComponent className="h-8 w-8 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold group-hover:text-purple-300 transition-colors duration-300">
                          {category.name}
                        </h3>
                        <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                          {category.count} articles
                        </p>
                      </div>
                    </div>
                  </Link>
                </m.div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
