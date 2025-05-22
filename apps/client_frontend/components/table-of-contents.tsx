"use client"

import { useState, useEffect } from "react"
import { Link } from "lucide-react"

interface TOCItem {
  id: string
  text: string
  level: number
}

const TableOfContents = () => {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const articleHeadings = Array.from(document.querySelectorAll("h2, h3, h4")).map((heading) => {
      const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, "-") || ""

      // Set id on the heading element if it doesn't have one
      if (!heading.id) {
        heading.id = id
      }

      return {
        id,
        text: heading.textContent || "",
        level: Number.parseInt(heading.tagName.substring(1)),
      }
    })

    setHeadings(articleHeadings)

    const handleScroll = () => {
      const headingElements = Array.from(document.querySelectorAll("h2, h3, h4"))

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const heading = headingElements[i]
        const rect = heading.getBoundingClientRect()

        if (rect.top <= 100) {
          setActiveId(heading.id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  if (headings.length === 0) {
    return null
  }

  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 mb-6 lg:mb-0">
      <div className="flex items-center mb-4">
        <Link className="h-4 w-4 mr-2 text-purple-400" />
        <h3 className="text-lg font-semibold">Table of Contents</h3>
      </div>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id} style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}>
              <a
                href={`#${heading.id}`}
                className={`block text-sm py-1 border-l-2 pl-3 hover:text-purple-400 transition-colors ${
                  activeId === heading.id ? "border-purple-500 text-purple-400" : "border-gray-700 text-gray-400"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default TableOfContents
