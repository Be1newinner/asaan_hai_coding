import HeroSection from "@/components/hero-section"
import BlogCard from "@/components/blog-card"
import { getAllBlogs, getAllCategories } from "@/lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function Home() {
  const blogs = getAllBlogs()
  const categories = getAllCategories()

  return (
    <div className="min-h-screen">
      <HeroSection />

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Latest Blogs</h2>
            <Link href="/categories">
              <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.slice(0, 6).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Explore Categories</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/category/${category.slug}`}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-6 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-400 text-sm">{category.count} articles</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
