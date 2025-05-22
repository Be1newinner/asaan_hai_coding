"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-gray-950/80 border-b border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Asaan Hai Coding Logo"
              width={40}
              height={40}
              className="rounded-md"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Asaan Hai Coding
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">
              Categories
            </Link>
            <Link href="/open-source" className="text-gray-300 hover:text-white transition-colors">
              Open Source
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-3">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              href="/categories"
              className="block px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
              onClick={toggleMenu}
            >
              Categories
            </Link>
            <Link
              href="/open-source"
              className="block px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
              onClick={toggleMenu}
            >
              Open Source
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
              onClick={toggleMenu}
            >
              About
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
