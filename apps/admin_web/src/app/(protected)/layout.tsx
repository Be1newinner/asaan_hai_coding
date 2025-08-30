import type React from "react"
// import { cookies } from "next/headers"
// import { redirect } from "next/navigation"
// import { AUTH_COOKIE } from "@/lib/config"
import { AdminShell } from "@/components/layout/admin-shell"
import { QueryProvider } from "../../components/providers/query-client-provider"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const c = await cookies()
  // const token = c.get(AUTH_COOKIE)?.value
  /*
  // Temporary Disabled
  if (!token) {
    redirect("/login")
  }
  */
  return (
    <QueryProvider>
      <AdminShell>{children}</AdminShell>
    </QueryProvider>
  )
}
