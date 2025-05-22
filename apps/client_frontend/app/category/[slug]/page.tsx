import { getBlogsByCategory, getAllCategories } from "@/lib/api"
import BlogCard from "@/components/blog-card"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  const categories = getAllCategories()
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const blogs = getBlogsByCategory(slug)
  const categories = getAllCategories()
  const category = categories.find((cat) => cat.slug === slug)

  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/categories">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="mr-1 h-4 w-4" /> All Categories
          </Button>
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
        <p className="text-gray-400">{category.count} articles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
