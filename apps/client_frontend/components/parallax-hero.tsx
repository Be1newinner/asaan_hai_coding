"use client"

import { useRef, useEffect, useState } from "react"
import { m, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion"
import SearchBar from "@/components/search-bar"

const ParallaxHero = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Optimized parallax transforms
  const backgroundY = useTransform(smoothProgress, [0, 1], ["0%", "50%"])
  const mountainsBackY = useTransform(smoothProgress, [0, 1], ["0%", "45%"])
  const mountainsMidY = useTransform(smoothProgress, [0, 1], ["0%", "35%"])
  const mountainsFrontY = useTransform(smoothProgress, [0, 1], ["0%", "25%"])
  const cloudsY = useTransform(smoothProgress, [0, 1], ["0%", "15%"])
  const textY = useTransform(smoothProgress, [0, 1], ["0%", "80%"])
  const opacity = useTransform(smoothProgress, [0, 0.6], [1, 0])

  // Mouse parallax effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      setMousePosition({
        x: (clientX - innerWidth / 2) / innerWidth,
        y: (clientY - innerHeight / 2) / innerHeight,
      })

      mouseX.set((clientX - innerWidth / 2) * 0.1)
      mouseY.set((clientY - innerHeight / 2) * 0.1)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Dynamic Gradient Background */}
      <m.div
        style={{
          y: backgroundY,
          background: `radial-gradient(circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%, 
            rgba(139, 92, 246, 0.3) 0%, 
            rgba(236, 72, 153, 0.2) 30%, 
            rgba(17, 24, 39, 0.8) 70%)`,
        }}
        className="absolute inset-0"
      />

      {/* Enhanced Stars Background */}
      <div className="absolute inset-0">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <m.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Enhanced Mountain Layers with better depth */}
      <m.div style={{ y: mountainsBackY }} className="absolute bottom-0 w-full">
        <svg viewBox="0 0 1200 300" className="w-full h-auto" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="backMountain" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(79, 70, 229, 0.4)" />
              <stop offset="100%" stopColor="rgba(79, 70, 229, 0.2)" />
            </linearGradient>
          </defs>
          <path
            d="M0,300 L0,180 L150,120 L300,140 L450,100 L600,130 L750,110 L900,125 L1050,105 L1200,120 L1200,300 Z"
            fill="url(#backMountain)"
          />
        </svg>
      </m.div>

      <m.div style={{ y: mountainsMidY }} className="absolute bottom-0 w-full">
        <svg viewBox="0 0 1200 300" className="w-full h-auto" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="midMountain" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(79, 70, 229, 0.6)" />
              <stop offset="100%" stopColor="rgba(79, 70, 229, 0.4)" />
            </linearGradient>
          </defs>
          <path
            d="M0,300 L0,200 L120,160 L240,180 L360,150 L480,170 L600,145 L720,165 L840,140 L960,155 L1080,135 L1200,150 L1200,300 Z"
            fill="url(#midMountain)"
          />
        </svg>
      </m.div>

      <m.div style={{ y: mountainsFrontY }} className="absolute bottom-0 w-full">
        <svg viewBox="0 0 1200 300" className="w-full h-auto" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="frontMountain" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(79, 70, 229, 0.8)" />
              <stop offset="100%" stopColor="rgba(79, 70, 229, 0.6)" />
            </linearGradient>
          </defs>
          <path
            d="M0,300 L0,220 L100,190 L200,210 L300,180 L400,200 L500,175 L600,195 L700,170 L800,185 L900,160 L1000,175 L1100,155 L1200,170 L1200,300 Z"
            fill="url(#frontMountain)"
          />
        </svg>
      </m.div>

      {/* Enhanced Floating Clouds */}
      <m.div style={{ y: cloudsY }} className="absolute top-20 w-full">
        <m.div className="cloud cloud1" style={{ x: mouseX, y: mouseY }} />
        <m.div className="cloud cloud2" style={{ x: mouseX.get() * 0.5, y: mouseY.get() * 0.5 }} />
        <m.div className="cloud cloud3" style={{ x: mouseX.get() * 0.3, y: mouseY.get() * 0.3 }} />
      </m.div>

      {/* Enhanced Glowing Moon */}
      <m.div
        className="absolute top-20 right-20 w-20 h-20 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 235, 59, 0.8) 0%, rgba(255, 235, 59, 0.4) 50%, transparent 100%)",
          boxShadow: "0 0 40px rgba(255, 235, 59, 0.6), 0 0 80px rgba(255, 235, 59, 0.3)",
          x: mouseX.get() * 0.1,
          y: mouseY.get() * 0.1,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Hero Content with enhanced animations */}
      <m.div style={{ y: textY, opacity }} className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <m.h1
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 1.2,
              delay: 0.2,
              type: "spring",
              stiffness: 100,
            }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
          >
            Asaan Hai Coding
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            Learn Dev the Easy Way!
          </m.p>

          <m.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 1,
              type: "spring",
              stiffness: 150,
            }}
          >
            <SearchBar />
          </m.div>
        </div>
      </m.div>

      {/* Enhanced Scroll Indicator */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
      >
        <m.div
          className="flex flex-col items-center cursor-pointer"
          whileHover={{ scale: 1.1 }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center relative overflow-hidden">
            <m.div
              className="w-1 h-3 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full mt-2"
              animate={{ y: [0, 16, 0] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </div>
        </m.div>
      </m.div>
    </div>
  )
}

export default ParallaxHero
