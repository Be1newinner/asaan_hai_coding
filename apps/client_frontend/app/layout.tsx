import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { MotionProvider } from "@/components/motion-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import FloatingActionButton from "@/components/floating-action-button"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Asaan Hai Coding – Learn Dev the Easy Way!",
  description: "Learn development the easy way with Asaan Hai Coding.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen flex flex-col overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <MotionProvider>
            <Navbar />
            <main className="flex-grow relative">{children}</main>
            <Footer />
            <FloatingActionButton />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
