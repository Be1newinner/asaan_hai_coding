"use client"

import { Button } from "@/components/ui/button"
import { X, Copy, Share2, ZoomIn, ZoomOut } from "lucide-react"
import { useState } from "react"

interface MarkdownPreviewModalProps {
  isOpen: boolean
  title: string
  content: string
  onClose: () => void
}

export default function MarkdownPreviewModal({ isOpen, title, content, onClose }: MarkdownPreviewModalProps) {
  const [fontSize, setFontSize] = useState(16)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/75 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-white">{title}</h2>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
            <Copy size={18} />
          </Button>
          <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
            <Share2 size={18} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setFontSize(Math.max(12, fontSize - 2))}
            className="text-slate-400 hover:text-white"
          >
            <ZoomOut size={18} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setFontSize(Math.min(24, fontSize + 2))}
            className="text-slate-400 hover:text-white"
          >
            <ZoomIn size={18} />
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-2xl mx-auto prose prose-invert" style={{ fontSize: `${fontSize}px` }}>
          <div className="text-slate-300 leading-relaxed space-y-4">
            {content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
