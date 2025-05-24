"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { m, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const pathname = usePathname()

  const { scrollY } = useScroll()

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY

    setIsScrolled(currentScrollY > 50)

    // Hide/show navbar based on scroll direction
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsVisible(false)
    } else {
      setIsVisible(true)
    }

    setLastScrollY(currentScrollY)
  }, [lastScrollY])

  useMotionValueEvent(scrollY, "change", (latest) => {
    const currentScrollY = latest

    setIsScrolled(currentScrollY > 50)

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsVisible(false)
    } else {
      setIsVisible(true)
    }

    setLastScrollY(currentScrollY)
  })

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navItems = [
    { href: "/", label: "Home", description: "Welcome to our blog" },
    { href: "/categories", label: "Categories", description: "Browse by topic" },
    { href: "/open-source", label: "Open Source", description: "Our contributions" },
    { href: "/about", label: "About", description: "Learn about us" },
  ]

  const isActiveRoute = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <m.nav
      initial={{ y: -100 }}
      animate={{
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "backdrop-blur-xl bg-gray-950/95 border-b border-gray-800/50 shadow-2xl shadow-purple-900/10"
          : "backdrop-blur-md bg-gray-950/50"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Asaan Hai Coding Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <m.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg opacity-20"
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Asaan Hai Coding
              </span>
            </Link>
          </m.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <m.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="relative group"
              >
                <Link
                  href={item.href}
                  className={`text-gray-300 hover:text-white transition-colors duration-300 relative py-2 px-1 ${
                    isActiveRoute(item.href) ? "text-purple-400" : ""
                  }`}
                >
                  {item.label}

                  {/* Active indicator */}
                  {isActiveRoute(item.href) && (
                    <m.span
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Hover indicator */}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                </Link>

                {/* Tooltip */}
                <m.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  whileHover={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  {item.description}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 border-l border-t border-gray-700 rotate-45"></div>
                </m.div>
              </m.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <m.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu" className="relative">
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <m.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </m.div>
                ) : (
                  <m.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </m.div>
                )}
              </AnimatePresence>
            </Button>
          </m.div>
        </div>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <m.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-3 space-y-1 bg-gray-900/80 backdrop-blur-md rounded-lg mt-4 border border-gray-800/50">
                {navItems.map((item, index) => (
                  <m.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`block px-4 py-3 rounded-md hover:bg-gray-800/50 transition-all duration-300 group ${
                        isActiveRoute(item.href) ? "bg-purple-900/30 text-purple-300" : ""
                      }`}
                      onClick={toggleMenu}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-sm text-gray-400 group-hover:text-gray-300">{item.description}</div>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-300 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </m.div>
                ))}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </m.nav>
  )
}

export default Navbar
