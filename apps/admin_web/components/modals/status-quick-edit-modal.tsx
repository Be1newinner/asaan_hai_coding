"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface StatusQuickEditModalProps {
  isOpen: boolean
  title: string
  currentStatus: string
  statusOptions: string[]
  onConfirm: (newStatus: string) => void
  onCancel: () => void
}

export default function StatusQuickEditModal({
  isOpen,
  title,
  currentStatus,
  statusOptions,
  onConfirm,
  onCancel,
}: StatusQuickEditModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)

  if (!isOpen) return null

  const hasChanged = selectedStatus !== currentStatus

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
          <CardDescription className="text-slate-400">Change the status of this item</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {hasChanged && (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-blue-400">
                Status will be updated to: <span className="font-semibold">{selectedStatus}</span>
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:text-white bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={() => onConfirm(selectedStatus)}
              disabled={!hasChanged}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white"
            >
              Update
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
