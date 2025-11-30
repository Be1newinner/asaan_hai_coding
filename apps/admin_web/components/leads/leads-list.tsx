"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Phone, Mail, MessageSquare, ChevronRight } from "lucide-react"

export default function LeadsList() {
  const [view, setView] = useState<"list" | "detail" | "editor">("list")
  const [selectedLead, setSelectedLead] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const leads = [
    {
      id: 1,
      name: "John Smith",
      email: "john@acmecorp.com",
      phone: "+1 (555) 123-4567",
      status: "new",
      source: "Landing",
      created: "2 hours ago",
      avatar: "JS",
      company: "Acme Corp",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@techstart.io",
      phone: "+1 (555) 987-6543",
      status: "contacted",
      source: "Course",
      created: "1 day ago",
      avatar: "SJ",
      company: "TechStart",
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael@innovate.co",
      phone: "+1 (555) 456-7890",
      status: "converted",
      source: "Webinar",
      created: "3 days ago",
      avatar: "MC",
      company: "Innovate Co",
    },
    {
      id: 4,
      name: "Emma Davis",
      email: "emma@growthlab.com",
      phone: "+1 (555) 234-5678",
      status: "lost",
      source: "Landing",
      created: "1 week ago",
      avatar: "ED",
      company: "Growth Lab",
    },
  ]

  if (view === "detail" && selectedLead) {
    return <LeadDetail lead={selectedLead} onBack={() => setView("list")} onEdit={() => setView("editor")} />
  }

  if (view === "editor" && selectedLead) {
    return <LeadEditor lead={selectedLead} onBack={() => setView("list")} />
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery)
    const matchesFilter = filterStatus === "all" || lead.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-500/20 text-blue-500"
      case "contacted":
        return "bg-yellow-500/20 text-yellow-500"
      case "converted":
        return "bg-green-500/20 text-green-500"
      case "lost":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground">Manage and track your leads</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
          <Plus size={18} />
          New Lead
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {["all", "new", "contacted", "converted", "lost"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filterStatus === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <Card className="border-border bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground hidden md:table-cell">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground hidden lg:table-cell">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground hidden md:table-cell">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-border hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedLead(lead)
                      setView("detail")
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
                          {lead.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{lead.name}</p>
                          <p className="text-xs text-muted-foreground">{lead.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-sm text-muted-foreground">{lead.email}</p>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-sm text-muted-foreground">{lead.created}</p>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button className="p-1 hover:bg-muted rounded">
                        <ChevronRight size={16} className="text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LeadDetail({ lead, onBack, onEdit }) {
  const [status, setStatus] = useState(lead.status)

  return (
    <div className="p-6 space-y-6">
      <button onClick={onBack} className="text-primary hover:text-primary/80 text-sm font-medium">
        ← Back to Leads
      </button>

      {/* Hero */}
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white">
                {lead.avatar}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{lead.name}</h1>
                <p className="text-muted-foreground">{lead.company}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              <Phone size={18} />
              Call
            </Button>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white">
              <Mail size={18} />
              Email
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <MessageSquare size={18} />
              WhatsApp
            </Button>
            <Button onClick={onEdit} variant="outline">
              Edit Lead
            </Button>
          </div>
        </div>

        {/* Status Card */}
        <Card className="border-border bg-card w-full md:w-72">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Lead Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div className="pt-2 border-t border-border space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Source</p>
                <p className="text-foreground font-medium">{lead.source}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="text-foreground font-medium">{lead.created}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Info */}
      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Contact Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="text-foreground font-medium break-all">{lead.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Phone</p>
              <p className="text-foreground font-medium">{lead.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Company</p>
              <p className="text-foreground font-medium">{lead.company}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Location</p>
              <p className="text-foreground font-medium">United States</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Notes</h2>
          <textarea
            defaultValue="Strong fit for our services. Follow up next week. Budget: $5k-10k"
            className="w-full h-24 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground font-mono text-sm resize-none"
          />
          <Button>Save Notes</Button>
        </CardContent>
      </Card>

      {/* Interaction Timeline */}
      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Interaction Timeline</h2>

          <div className="space-y-4">
            {[
              { date: "Today", time: "2:30 PM", action: "Email sent", details: "Follow-up email sent" },
              {
                date: "Yesterday",
                time: "10:15 AM",
                action: "Call",
                details: "Had productive call, discussing package",
              },
              { date: "2 days ago", time: "3:45 PM", action: "Lead created", details: "From landing page form" },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 pb-4 border-b border-border last:pb-0 last:border-0">
                <div className="text-center flex-shrink-0">
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                  <p className="text-xs font-semibold text-muted-foreground">{activity.time}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.details}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LeadEditor({ lead, onBack }) {
  const [formData, setFormData] = useState({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    status: lead.status,
    source: lead.source,
  })

  return (
    <div className="p-6 space-y-6">
      <button onClick={onBack} className="text-primary hover:text-primary/80 text-sm font-medium">
        ← Back to Lead
      </button>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit Lead</h1>
        <p className="text-muted-foreground">Update lead information</p>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Name</label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone</label>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Company</label>
              <Input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Source</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground"
              >
                <option value="Landing">Landing</option>
                <option value="Course">Course</option>
                <option value="Webinar">Webinar</option>
                <option value="Referral">Referral</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button onClick={onBack} variant="outline">
              Discard
            </Button>
            <Button>Save Changes</Button>
            <Button className="ml-auto bg-green-600 hover:bg-green-700 text-white">Convert to Student</Button>
            <Button variant="destructive">Delete Lead</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
