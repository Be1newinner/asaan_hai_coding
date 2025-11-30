"use client"

import { useState } from "react"
import MainLayout from "@/components/layouts/main-layout"
import DashboardHome from "@/components/dashboard/dashboard-home"
import ProjectsList from "@/components/projects/projects-list"
import CoursesList from "@/components/courses/courses-list"
import LeadsList from "@/components/leads/leads-list"
import ProfileView from "@/components/profile/profile-view"
import SettingsHome from "@/components/settings/settings-home"

type TabType = "dashboard" | "projects" | "courses" | "leads" | "profile" | "settings"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardHome />
      case "projects":
        return <ProjectsList />
      case "courses":
        return <CoursesList />
      case "leads":
        return <LeadsList />
      case "profile":
        return <ProfileView />
      case "settings":
        return <SettingsHome />
      default:
        return <DashboardHome />
    }
  }

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </MainLayout>
  )
}
