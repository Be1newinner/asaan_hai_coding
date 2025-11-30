"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { useState } from "react"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  title: string
  description: string
  itemName: string
  onConfirm: () => void
  onCancel: () => void
  requiresTyping?: boolean
}

export default function DeleteConfirmationModal({
  isOpen,
  title,
  description,
  itemName,
  onConfirm,
  onCancel,
  requiresTyping = false,
}: DeleteConfirmationModalProps) {
  const [confirmText, setConfirmText] = useState("")

  if (!isOpen) return null

  const isConfirmed = !requiresTyping || confirmText === itemName

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800/95 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <CardTitle className="text-white">{title}</CardTitle>
              <CardDescription className="text-slate-400 mt-1">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-slate-300 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
            This action cannot be undone. Please be certain.
          </p>

          {requiresTyping && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Type <span className="font-mono font-bold text-white">"{itemName}"</span> to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type here..."
                className="w-full px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-500 text-sm"
              />
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:text-white bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={!isConfirmed}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white"
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
