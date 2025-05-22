"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const SearchBar = () => {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for tutorials, guides, and more..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-16 py-6 bg-gray-900/50 border-gray-700 focus:border-purple-500 placeholder:text-gray-500 text-gray-200"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
        <Button
          type="submit"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700"
          size="sm"
        >
          Search
        </Button>
      </div>
    </form>
  )
}

export default SearchBar
