"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { m, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useState } from "react"

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
  index?: number
}

const BlogCard = ({ post, index = 0 }: BlogCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Mouse position tracking for 3D effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 30 })

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ z: 50 }}
      className="perspective-1000 group"
    >
      <Link href={`/blog/${post.slug}`}>
        <Card className="overflow-hidden h-full bg-gray-900/60 backdrop-blur-md border-gray-800/50 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/30 relative">
          {/* Glow effect on hover */}
          <m.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg opacity-0 blur-xl"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          <div className="relative h-48 w-full overflow-hidden">
            {/* Loading skeleton */}
            {!isImageLoaded && <div className="absolute inset-0 bg-gray-800 animate-pulse" />}

            <Image
              src={post.thumbnail || "/placeholder.svg?height=400&width=600"}
              alt={post.title}
              fill
              className={`object-cover transition-all duration-700 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              } ${isHovered ? "scale-110" : "scale-100"}`}
              onLoad={() => setIsImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Gradient overlay */}
            <m.div
              className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Floating category badge */}
            <m.div
              className="absolute top-4 left-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8,
                y: isHovered ? 0 : 10,
              }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-sm text-white border-0 shadow-lg"
              >
                {post.category}
              </Badge>
            </m.div>
          </div>

          <CardContent className="p-6 relative" style={{ transform: "translateZ(20px)" }}>
            <m.div className="mb-3" animate={{ y: isHovered ? -5 : 0 }} transition={{ duration: 0.3 }}>
              <Badge
                variant="secondary"
                className={`bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-purple-300 border border-purple-500/30 transition-all duration-300 ${
                  isHovered ? "opacity-0" : "opacity-100"
                }`}
              >
                {post.category}
              </Badge>
            </m.div>

            <m.h3
              className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors duration-300"
              animate={{ y: isHovered ? -2 : 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              {post.title}
            </m.h3>

            <m.p
              className="text-gray-400 text-sm line-clamp-3 group-hover:text-gray-300 transition-colors duration-300"
              animate={{ y: isHovered ? -2 : 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {post.excerpt}
            </m.p>
          </CardContent>

          <CardFooter
            className="px-6 pb-6 pt-0 flex justify-between text-gray-500 text-xs relative"
            style={{ transform: "translateZ(10px)" }}
          >
            <m.span
              className="group-hover:text-gray-400 transition-colors duration-300"
              animate={{ y: isHovered ? -2 : 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              {post.date}
            </m.span>

            {/* Read time indicator */}
            <m.span
              className="text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300"
              animate={{
                y: isHovered ? -2 : 0,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              5 min read
            </m.span>
          </CardFooter>

          {/* Shine effect */}
          <m.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0"
            animate={{
              x: isHovered ? "100%" : "-100%",
              opacity: isHovered ? [0, 1, 0] : 0,
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </Card>
      </Link>
    </m.div>
  )
}

export default BlogCard
