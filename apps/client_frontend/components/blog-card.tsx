import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  thumbnail: string
}

interface BlogCardProps {
  post: BlogPost
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="overflow-hidden h-full bg-gray-900 border-gray-800 hover:border-gray-700 transition-all hover:shadow-md hover:shadow-purple-900/20 hover:-translate-y-1">
        <div className="relative h-48 w-full">
          <Image src={post.thumbnail || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>
        <CardContent className="p-4">
          <Badge variant="secondary" className="mb-2 bg-purple-900/30 hover:bg-purple-900/50 text-purple-300">
            {post.category}
          </Badge>
          <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
          <p className="text-gray-400 text-sm line-clamp-3">{post.excerpt}</p>
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0 flex justify-between text-gray-500 text-xs">
          <span>{post.date}</span>
        </CardFooter>
      </Card>
    </Link>
  )
}

export default BlogCard
