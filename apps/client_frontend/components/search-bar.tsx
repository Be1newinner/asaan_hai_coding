"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { m } from "framer-motion"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const SearchBar = () => {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <m.form
      onSubmit={handleSearch}
      className="relative w-full max-w-2xl mx-auto"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <m.div
        className="relative"
        animate={{
          boxShadow: isFocused ? "0 0 30px rgba(168, 85, 247, 0.4)" : "0 0 0px rgba(168, 85, 247, 0)",
        }}
        transition={{ duration: 0.3 }}
      >
        <Input
          type="text"
          placeholder="Search for tutorials, guides, and more..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pl-12 pr-16 py-6 bg-gray-900/70 backdrop-blur-md border-gray-700 focus:border-purple-500 placeholder:text-gray-500 text-gray-200 rounded-2xl transition-all duration-300"
        />

        <m.div
          className="absolute left-4 top-1/2 transform -translate-y-1/2"
          animate={{ rotate: isFocused ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Search className="text-gray-500 h-5 w-5" />
        </m.div>

        <m.div
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl px-6"
            size="sm"
          >
            Search
          </Button>
        </m.div>
      </m.div>
    </m.form>
  )
}

export default SearchBar
