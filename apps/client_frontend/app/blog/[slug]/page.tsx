import { getAllBlogs } from "@/lib/api"
import BlogPageClient from "./BlogPageClient"

export function generateStaticParams() {
  const blogs = getAllBlogs()
  return blogs.map((blog) => ({
    slug: blog.slug,
  }))
}

export default function BlogPage({ params }: { params: { slug: string } }) {
  return <BlogPageClient params={params} />
}
