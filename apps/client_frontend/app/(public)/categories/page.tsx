import type React from "react"
import { getAllCategories } from "@/lib/api"
import Link from "next/link"
import { Code, Database, Server, Layers, Terminal, Globe } from "lucide-react"

// Map of category names to icons
const categoryIcons: Record<string, React.ReactNode> = {
  Frontend: <Code className="h-8 w-8 text-purple-400" />,
  Backend: <Server className="h-8 w-8 text-green-400" />,
  DevOps: <Terminal className="h-8 w-8 text-blue-400" />,
  Database: <Database className="h-8 w-8 text-yellow-400" />,
  Architecture: <Layers className="h-8 w-8 text-red-400" />,
  Web: <Globe className="h-8 w-8 text-cyan-400" />,
}

export default function CategoriesPage() {
  const categories = getAllCategories()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Categories</h1>
        <p className="text-gray-400 mb-8">Browse all our content categories to find exactly what you're looking for.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/category/${category.slug}`}
              className="flex items-center p-6 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-all hover:shadow-md hover:shadow-purple-900/20"
            >
              <div className="mr-4">{categoryIcons[category.name] || <Layers className="h-8 w-8 text-gray-400" />}</div>
              <div>
                <h2 className="text-xl font-semibold mb-1">{category.name}</h2>
                <p className="text-gray-400 text-sm">{category.count} articles</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
