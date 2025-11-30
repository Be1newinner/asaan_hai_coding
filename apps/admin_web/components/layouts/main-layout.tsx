"use client"

import type React from "react"

import { BarChart3, FolderOpen, Book, Users, User, Settings, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface MainLayoutProps {
  children: React.ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function MainLayout({ children, activeTab, onTabChange }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "courses", label: "Courses", icon: Book },
    { id: "leads", label: "Leads", icon: Users },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-background">
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card border-r border-border transition-all duration-300 flex-col h-full hidden md:flex`}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <span className="text-foreground font-bold">AdminHub</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-muted-foreground hover:text-foreground"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="text-sm font-medium">{tab.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="w-full h-10 rounded-lg bg-muted flex items-center justify-center">
            {sidebarOpen ? (
              <span className="text-xs text-muted-foreground">Profile</span>
            ) : (
              <User size={18} className="text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto pb-20 md:pb-0">{children}</div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-30 safe-area-bottom">
        <nav className="flex items-center justify-around px-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[56px] ${
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground active:bg-accent"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
