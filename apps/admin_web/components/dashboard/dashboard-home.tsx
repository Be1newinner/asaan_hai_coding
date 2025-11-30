"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function DashboardHome() {
  // temporary KPIs
  const kpis = [
    {
      title: "Total Projects",
      value: "24",
      change: "+12%",
      isPositive: true,
      icon: "📊",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Active Courses",
      value: "8",
      change: "+5%",
      isPositive: true,
      icon: "📚",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Total Lessons",
      value: "156",
      change: "+23%",
      isPositive: true,
      icon: "✏️",
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Leads Today",
      value: "14",
      change: "-3%",
      isPositive: false,
      icon: "👥",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Completion Rate",
      value: "87%",
      change: "+8%",
      isPositive: true,
      icon: "✅",
      color: "from-indigo-500 to-blue-500",
    },
    {
      title: "This Week Leads",
      value: "89",
      change: "+15%",
      isPositive: true,
      icon: "📈",
      color: "from-teal-500 to-cyan-500",
    },
  ];

  const quickActions = [
    { id: 1, label: "Add Project", icon: Plus },
    { id: 2, label: "Add Course", icon: Plus },
    { id: 3, label: "Add Lesson", icon: Plus },
    { id: 4, label: "Add Lead", icon: Plus },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "lead",
      title: "New lead created",
      description: "John Smith from Acme Corp",
      time: "2 hours ago",
      avatar: "👤",
    },
    {
      id: 2,
      type: "enrollment",
      title: "New enrollment",
      description: "Sarah Johnson enrolled in Advanced React",
      time: "4 hours ago",
      avatar: "📚",
    },
    {
      id: 3,
      type: "update",
      title: "Course updated",
      description: 'Updated content for "Web Development Basics"',
      time: "1 day ago",
      avatar: "✏️",
    },
    {
      id: 4,
      type: "lesson",
      title: "Lesson published",
      description: 'New lesson: "Advanced State Management"',
      time: "2 days ago",
      avatar: "🎓",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, Admin
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your projects today
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <Card
            key={kpi.title}
            className="border-border bg-card hover:bg-accent/50 transition-colors"
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">
                    {kpi.title}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {kpi.value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {kpi.isPositive ? (
                      <ArrowUpRight size={16} className="text-green-500" />
                    ) : (
                      <ArrowDownRight size={16} className="text-red-500" />
                    )}
                    <span
                      className={
                        kpi.isPositive ? "text-green-500" : "text-red-500"
                      }
                    >
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center text-2xl opacity-80`}
                >
                  {kpi.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Button key={action.id} className="h-12 font-semibold">
              <Plus size={18} />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          Recent Activity
        </h2>
        <Card className="border-border bg-card">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 hover:bg-accent/50 transition-colors flex items-start justify-between cursor-pointer"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg flex-shrink-0">
                      {activity.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {activity.title}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-muted rounded-lg transition-colors">
                    <MoreVertical size={16} className="text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
