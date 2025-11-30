"use client"

import type React from "react"
import { ToastContainer } from "@/components/common/toast-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  )
}
