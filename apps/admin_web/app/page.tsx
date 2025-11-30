"use client"

import { useState } from "react"
import LoginForm from "@/components/auth/login-form"
import ForgotPasswordForm from "@/components/auth/forgot-password-form"

export default function AuthPage() {
  const [page, setPage] = useState<"login" | "forgot-password">("login")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {page === "login" ? (
          <LoginForm onForgotPassword={() => setPage("forgot-password")} />
        ) : (
          <ForgotPasswordForm onBackToLogin={() => setPage("login")} />
        )}
      </div>
    </div>
  )
}
