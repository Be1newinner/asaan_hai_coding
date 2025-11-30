"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  Lock,
  Database,
  Sun,
  Moon,
  Monitor,
  User,
  Bell,
  Palette,
  Shield,
  Info,
  LogOut,
  Download,
  Trash2,
  Smartphone,
  Globe,
  Clock,
} from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"

export default function SettingsHome() {
  const [view, setView] = useState<"home" | "account" | "notifications" | "appearance" | "security" | "about">("home")

  const sections = [
    { id: "account", title: "Account", description: "Manage your account details and preferences", icon: User },
    { id: "notifications", title: "Notifications", description: "Configure email and push notifications", icon: Bell },
    { id: "appearance", title: "Appearance", description: "Customize theme and display settings", icon: Palette },
    { id: "security", title: "Data & Security", description: "Manage security and data preferences", icon: Shield },
    { id: "about", title: "About App", description: "Version and app information", icon: Info },
  ]

  return (
    <div className="min-h-full">
      {/* Desktop/Tablet: Two-column layout */}
      <div className="hidden md:flex h-full">
        {/* Left sidebar - settings menu */}
        <div className="w-72 lg:w-80 border-r border-border bg-card/30 p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
          </div>

          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon
              const isActive = view === section.id || (view === "home" && section.id === "account")
              return (
                <button
                  key={section.id}
                  onClick={() => setView(section.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "hover:bg-muted/50 text-foreground"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? "bg-primary/20" : "bg-muted/50"}`}>
                    <Icon size={18} className={isActive ? "text-primary" : "text-muted-foreground"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${isActive ? "text-primary" : "text-foreground"}`}>
                      {section.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{section.description}</p>
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Right content area */}
        <div className="flex-1 overflow-auto">
          <SettingsDetail section={view === "home" ? "account" : view} onBack={() => {}} isDesktop={true} />
        </div>
      </div>

      {/* Mobile: Stack navigation */}
      <div className="md:hidden">
        {view === "home" ? (
          <div className="p-4 space-y-4">
            <div className="pt-2 pb-4">
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
            </div>

            <div className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setView(section.id as any)}
                    className="w-full bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors active:scale-[0.98]"
                  >
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Icon size={22} className="text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-foreground">{section.title}</h3>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                    <ChevronRight size={20} className="text-muted-foreground" />
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <SettingsDetail section={view} onBack={() => setView("home")} isDesktop={false} />
        )}
      </div>
    </div>
  )
}

function SettingsDetail({ section, onBack, isDesktop }: { section: string; onBack: () => void; isDesktop: boolean }) {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <div className={`${isDesktop ? "p-8 max-w-3xl" : "p-4"} space-y-6`}>
      {/* Mobile back button */}
      {!isDesktop && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium py-2"
        >
          <ChevronRight size={16} className="rotate-180" />
          Back to Settings
        </button>
      )}

      {section === "account" && (
        <div className="space-y-6">
          <div>
            <h1 className={`${isDesktop ? "text-2xl" : "text-xl"} font-bold text-foreground`}>Account Settings</h1>
            <p className="text-muted-foreground text-sm mt-1">Update your account information</p>
          </div>

          <Card className="border-border bg-card">
            <CardContent className={`${isDesktop ? "p-6" : "p-4"} space-y-6`}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email Address</label>
                  <input
                    type="email"
                    defaultValue="alex@adminpanel.com"
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <input
                    defaultValue="Alex Johnson"
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  />
                </div>

                <div className={`grid grid-cols-1 ${isDesktop ? "sm:grid-cols-2" : ""} gap-4`}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Globe size={14} className="text-muted-foreground" />
                      Language
                    </label>
                    <select className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Clock size={14} className="text-muted-foreground" />
                      Timezone
                    </label>
                    <select className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors">
                      <option>PST (UTC-8)</option>
                      <option>EST (UTC-5)</option>
                      <option>UTC (UTC+0)</option>
                      <option>IST (UTC+5:30)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button className="w-full sm:w-auto">Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          {/* Security section */}
          <Card className="border-border bg-card">
            <CardContent className={`${isDesktop ? "p-6" : "p-4"} space-y-4`}>
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Lock size={18} className="text-muted-foreground" />
                Security
              </h3>
              <div className={`flex ${isDesktop ? "flex-row" : "flex-col"} gap-3`}>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Lock size={16} />
                  Change Password
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
                >
                  <LogOut size={16} />
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {section === "notifications" && (
        <div className="space-y-6">
          <div>
            <h1 className={`${isDesktop ? "text-2xl" : "text-xl"} font-bold text-foreground`}>Notification Settings</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage how you receive notifications</p>
          </div>

          <Card className="border-border bg-card">
            <CardContent className={`${isDesktop ? "p-6" : "p-4"} space-y-4`}>
              <h3 className="font-semibold text-foreground">Push Notifications</h3>
              <div className="space-y-3">
                {[
                  { label: "New Lead Created", description: "Get notified when a new lead is added" },
                  { label: "Course Purchase", description: "Receive updates on course purchases" },
                  { label: "Student Progress", description: "Track student course progress" },
                  { label: "System Alerts", description: "Important system notifications" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-12 h-7 bg-muted rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground/80 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary peer-checked:after:bg-primary-foreground" />
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className={`${isDesktop ? "p-6" : "p-4"} space-y-4`}>
              <div>
                <h3 className="font-semibold text-foreground">Quiet Hours</h3>
                <p className="text-sm text-muted-foreground mt-1">Mute notifications during these hours</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <input
                  type="time"
                  defaultValue="22:00"
                  className="px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/50"
                />
                <span className="text-muted-foreground font-medium">to</span>
                <input
                  type="time"
                  defaultValue="08:00"
                  className="px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </CardContent>
          </Card>

          <div className={`flex ${isDesktop ? "flex-row" : "flex-col"} gap-3`}>
            <Button>Save Preferences</Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Smartphone size={16} />
              Test Notification
            </Button>
          </div>
        </div>
      )}

      {section === "appearance" && (
        <div className="space-y-6">
          <div>
            <h1 className={`${isDesktop ? "text-2xl" : "text-xl"} font-bold text-foreground`}>Appearance</h1>
            <p className="text-muted-foreground text-sm mt-1">Customize how the app looks</p>
          </div>

          <Card className="border-border bg-card">
            <CardContent className={`${isDesktop ? "p-6" : "p-4"} space-y-6`}>
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Theme</h3>
                <div className={`grid grid-cols-1 ${isDesktop ? "sm:grid-cols-3" : ""} gap-3`}>
                  {[
                    {
                      name: "light" as const,
                      label: "Light",
                      icon: Sun,
                      bgPreview: "bg-slate-100",
                      iconColor: "text-amber-500",
                    },
                    {
                      name: "dark" as const,
                      label: "Dark",
                      icon: Moon,
                      bgPreview: "bg-slate-800",
                      iconColor: "text-indigo-400",
                    },
                    {
                      name: "system" as const,
                      label: "System",
                      icon: Monitor,
                      bgPreview: "bg-gradient-to-r from-slate-100 to-slate-800",
                      iconColor: "text-muted-foreground",
                    },
                  ].map((themeOption) => (
                    <button
                      key={themeOption.name}
                      onClick={() => setTheme(themeOption.name)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        theme === themeOption.name
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border bg-background hover:border-muted-foreground/50"
                      }`}
                    >
                      <div
                        className={`h-20 rounded-lg ${themeOption.bgPreview} mb-3 flex items-center justify-center shadow-inner`}
                      >
                        <themeOption.icon className={`w-8 h-8 ${themeOption.iconColor}`} />
                      </div>
                      <p className="text-foreground font-semibold">{themeOption.label}</p>
                      {theme === themeOption.name && <p className="text-xs text-primary mt-1 font-medium">Active</p>}
                    </button>
                  ))}
                </div>
                {theme === "system" && (
                  <p className="text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-lg">
                    Currently using{" "}
                    <span className="font-medium text-foreground">{resolvedTheme === "dark" ? "Dark" : "Light"}</span>{" "}
                    theme based on your system preference
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                <h3 className="font-semibold text-foreground">Display Density</h3>
                <div className={`grid grid-cols-1 ${isDesktop ? "sm:grid-cols-3" : ""} gap-2`}>
                  {["Compact", "Comfortable", "Spacious"].map((density) => (
                    <button
                      key={density}
                      className={`px-4 py-3 rounded-lg border transition-colors ${
                        density === "Comfortable"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-background text-foreground hover:border-muted-foreground/50"
                      }`}
                    >
                      {density}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {section === "security" && (
        <div className="space-y-6">
          <div>
            <h1 className={`${isDesktop ? "text-2xl" : "text-xl"} font-bold text-foreground`}>Data & Security</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your data and security settings</p>
          </div>

          <Card className="border-border bg-card">
            <CardContent className={`${isDesktop ? "p-6" : "p-4"} space-y-3`}>
              <h3 className="font-semibold text-foreground mb-4">Data Management</h3>
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 bg-transparent">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Download size={18} className="text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Export My Data</p>
                  <p className="text-sm text-muted-foreground">Download all your data as JSON</p>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 bg-transparent">
                <div className="p-2 rounded-lg bg-muted">
                  <Database size={18} className="text-muted-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Clear Cache</p>
                  <p className="text-sm text-muted-foreground">Clear locally stored data</p>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 bg-transparent">
                <div className="p-2 rounded-lg bg-muted">
                  <Smartphone size={18} className="text-muted-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Manage Sessions</p>
                  <p className="text-sm text-muted-foreground">View and revoke active sessions</p>
                </div>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className={`${isDesktop ? "p-6" : "p-4"} space-y-4`}>
              <div>
                <h3 className="font-semibold text-destructive flex items-center gap-2">
                  <Trash2 size={18} />
                  Danger Zone
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <Button variant="destructive" className="gap-2">
                <Trash2 size={16} />
                Delete My Account
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {section === "about" && (
        <div className="space-y-6">
          <div>
            <h1 className={`${isDesktop ? "text-2xl" : "text-xl"} font-bold text-foreground`}>About AdminHub</h1>
            <p className="text-muted-foreground text-sm mt-1">App information and resources</p>
          </div>

          <Card className="border-border bg-card">
            <CardContent className={`${isDesktop ? "p-6" : "p-4"}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-foreground">A</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">AdminHub</h2>
                  <p className="text-muted-foreground">Version 1.0.0</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Build</span>
                  <span className="text-foreground font-medium">2025.11.30</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Environment</span>
                  <span className="text-foreground font-medium">Production</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="text-foreground font-medium">November 30, 2025</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className={`${isDesktop ? "p-6" : "p-4"} space-y-3`}>
              <h3 className="font-semibold text-foreground">Resources</h3>
              {[
                { label: "Terms of Service", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Contact Support", href: "#" },
                { label: "Documentation", href: "#" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/30 transition-colors group"
                >
                  <span className="text-foreground">{link.label}</span>
                  <ChevronRight
                    size={18}
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  />
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
