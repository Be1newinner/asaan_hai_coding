"use client"

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-12 bg-slate-700/30 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-64 bg-slate-700/30 rounded-lg" />
        </div>
      ))}
    </div>
  )
}
