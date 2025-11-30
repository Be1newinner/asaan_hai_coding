"use client"

import { useState, useEffect } from "react"
import { X, AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react"

interface ToastMessage {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  description?: string
  duration?: number
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const message: ToastMessage = { ...toast, id }
    setToasts((prev) => [...prev, message])

    if (toast.duration !== 0) {
      setTimeout(() => removeToast(id), toast.duration || 5000)
    }
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  useEffect(() => {
    ;(window as any).addToast = addToast
  }, [])

  const typeClasses = {
    success: "bg-green-500/10 border-green-500/20 text-green-400",
    error: "bg-red-500/10 border-red-500/20 text-red-400",
    info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  }

  const iconMap = {
    success: <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />,
    error: <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />,
    info: <Info size={18} className="flex-shrink-0 mt-0.5" />,
    warning: <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />,
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex gap-3 p-4 rounded-lg border text-sm animate-in fade-in slide-in-from-bottom-4 duration-300 ${typeClasses[toast.type]}`}
        >
          {iconMap[toast.type]}
          <div className="flex-1">
            <p className="font-semibold">{toast.title}</p>
            {toast.description && <p className="text-xs opacity-90 mt-1">{toast.description}</p>}
          </div>
          <button onClick={() => removeToast(toast.id)} className="flex-shrink-0 hover:opacity-70">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
