"use client"

import { useState, useEffect } from "react"
import { m, AnimatePresence } from "framer-motion"
import { ArrowUp, MessageCircle, Share2 } from "lucide-react"

const FloatingActionButton = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
        setIsExpanded(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const actions = [
    {
      icon: Share2,
      label: "Share",
      action: () => {
        if (navigator.share) {
          navigator.share({
            title: document.title,
            url: window.location.href,
          })
        }
      },
    },
    {
      icon: MessageCircle,
      label: "Feedback",
      action: () => {
        // Open feedback modal or redirect to contact
        console.log("Open feedback")
      },
    },
  ]

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-50">
          {/* Action Buttons */}
          <AnimatePresence>
            {isExpanded && (
              <m.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="flex flex-col space-y-3 mb-3"
              >
                {actions.map((action, index) => (
                  <m.button
                    key={action.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={action.action}
                    className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-sm border border-gray-700/50 transition-all duration-200"
                  >
                    <action.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </m.button>
                ))}
              </m.div>
            )}
          </AnimatePresence>

          {/* Main FAB */}
          <m.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={isExpanded ? () => setIsExpanded(false) : scrollToTop}
            onContextMenu={(e) => {
              e.preventDefault()
              setIsExpanded(!isExpanded)
            }}
            className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg hover:shadow-xl hover:shadow-purple-500/25 flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
            aria-label="Scroll to top"
          >
            <m.div animate={{ rotate: isExpanded ? 45 : 0 }} transition={{ duration: 0.2 }}>
              <ArrowUp className="h-6 w-6" />
            </m.div>
          </m.button>

          {/* Expand hint */}
          {!isExpanded && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="absolute -top-12 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none opacity-0 hover:opacity-100"
            >
              Right-click for more options
            </m.div>
          )}
        </div>
      )}
    </AnimatePresence>
  )
}

export default FloatingActionButton
