import { Suspense } from "react"
import { KPIs } from "@/components/dashboard/kpis"

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <Suspense
        fallback={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-md bg-muted animate-pulse" />
            ))}
          </div>
        }
      >
        <KPIs />
      </Suspense>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-md border p-4">
          <h3 className="text-sm font-medium">Recent Courses</h3>
          <p className="text-sm text-muted-foreground mt-2">Coming soon</p>
        </div>
        <div className="rounded-md border p-4">
          <h3 className="text-sm font-medium">Recent Media</h3>
          <p className="text-sm text-muted-foreground mt-2">Coming soon</p>
        </div>
      </div>
    </div>
  )
}
