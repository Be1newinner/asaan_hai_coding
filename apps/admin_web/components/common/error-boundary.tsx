"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(event.error)
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-500/20 bg-red-500/10">
          <CardContent className="p-6 flex gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-red-400">Something went wrong</h2>
              <p className="text-sm text-red-300 mt-1">{error.message}</p>
              <button
                onClick={() => setError(null)}
                className="mt-3 px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm"
              >
                Try again
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
