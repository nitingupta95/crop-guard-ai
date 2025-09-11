"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { NotificationContainer } from "@/components/agriculture/alert-notification"
import { StatusBadge } from "@/components/agriculture/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Bug, Droplets, Wind, Search, Filter, Bell, CheckCircle, Clock } from "lucide-react"

// ------------------ Types ------------------
type Alert = {
  id: string
  type: "error" | "warning" | "info" | "success"
  title: string
  message: string
  timestamp: Date
  fieldName: string
  severity: "critical" | "medium" | "low"
  category: "pest" | "irrigation" | "weather" | "disease" | "system"
  status: "active" | "acknowledged" | "resolved"
  affectedArea: number
  estimatedLoss: number
}

type Notification = {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  message: string
  timestamp: Date
  autoClose?: boolean
}

// ------------------ Mock Data ------------------
const mockAlerts: Alert[] = [
  {
    id: "alert-1",
    type: "error",
    title: "Critical Pest Infestation",
    message: "Severe aphid infestation detected in North Field Zone C. Immediate action required.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    fieldName: "North Field",
    severity: "critical",
    category: "pest",
    status: "active",
    affectedArea: 15,
    estimatedLoss: 2500,
  },
  {
    id: "alert-2",
    type: "warning",
    title: "Low Soil Moisture",
    message: "Soil moisture levels below optimal range in South Field. Consider irrigation.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    fieldName: "South Field",
    severity: "medium",
    category: "irrigation",
    status: "active",
    affectedArea: 45,
    estimatedLoss: 800,
  },
  {
    id: "alert-3",
    type: "info",
    title: "Weather Advisory",
    message: "Heavy rainfall expected in the next 48 hours. Prepare drainage systems.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    fieldName: "All Fields",
    severity: "low",
    category: "weather",
    status: "acknowledged",
    affectedArea: 300,
    estimatedLoss: 0,
  },
  {
    id: "alert-4",
    type: "warning",
    title: "Disease Risk Elevated",
    message: "Fungal disease conditions favorable in East Field. Monitor closely.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    fieldName: "East Field",
    severity: "medium",
    category: "disease",
    status: "resolved",
    affectedArea: 25,
    estimatedLoss: 1200,
  },
  {
    id: "alert-5",
    type: "success",
    title: "Irrigation System Activated",
    message: "Automated irrigation successfully activated in response to moisture alert.",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    fieldName: "South Field",
    severity: "low",
    category: "system",
    status: "resolved",
    affectedArea: 0,
    estimatedLoss: 0,
  },
]

// ------------------ Component ------------------
export default function AlertsPage() {
  const [selectedTab, setSelectedTab] = useState<"all" | "active" | "acknowledged" | "resolved">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState<Notification[]>([])

  const filteredAlerts = mockAlerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.fieldName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = selectedTab === "all" || alert.status === selectedTab
    return matchesSearch && matchesTab
  })

  const getAlertIcon = (category: Alert["category"]) => {
    switch (category) {
      case "pest":
        return Bug
      case "irrigation":
        return Droplets
      case "weather":
        return Wind
      case "disease":
        return AlertTriangle
      case "system":
        return CheckCircle
      default:
        return AlertTriangle
    }
  }

  const getSeverityColor = (severity: Alert["severity"]) => {
    switch (severity) {
      case "critical":
        return "text-destructive"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "low":
        return "text-primary"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusIcon = (status: Alert["status"]) => {
    switch (status) {
      case "active":
        return Clock
      case "acknowledged":
        return Bell
      case "resolved":
        return CheckCircle
      default:
        return Clock
    }
  }

  const handleAlertAction = (alertId: string, action: string) => {
    console.log(`${action} alert:`, alertId)
    const alert = mockAlerts.find((a) => a.id === alertId)
    if (alert) {
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        type: "success",
        title: `Alert ${action}`,
        message: `${alert.title} has been ${action.toLowerCase()}`,
        timestamp: new Date(),
        autoClose: true,
      }
      setNotifications((prev) => [...prev, notification])
    }
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const alertCounts = {
    all: mockAlerts.length,
    active: mockAlerts.filter((a) => a.status === "active").length,
    acknowledged: mockAlerts.filter((a) => a.status === "acknowledged").length,
    resolved: mockAlerts.filter((a) => a.status === "resolved").length,
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 md:ml-64 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Alerts & Notifications</h1>
            <p className="text-muted-foreground">Monitor and manage agricultural alerts and system notifications</p>
          </div>
          <Button>
            <Bell className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>

        {/* Alert Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Critical */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div>
                  <p className="text-2xl font-bold text-destructive">
                    {mockAlerts.filter((a) => a.severity === "critical").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Critical Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active */}
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{alertCounts.active}</p>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acknowledged */}
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Bell className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{alertCounts.acknowledged}</p>
                  <p className="text-sm text-muted-foreground">Acknowledged</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resolved */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-primary">{alertCounts.resolved}</p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Alerts List */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as typeof selectedTab)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({alertCounts.all})</TabsTrigger>
                <TabsTrigger value="active">Active ({alertCounts.active})</TabsTrigger>
                <TabsTrigger value="acknowledged">Acknowledged ({alertCounts.acknowledged})</TabsTrigger>
                <TabsTrigger value="resolved">Resolved ({alertCounts.resolved})</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="space-y-4 mt-6">
                {filteredAlerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No alerts found matching your criteria</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAlerts.map((alert) => {
                      const Icon = getAlertIcon(alert.category)
                      const StatusIcon = getStatusIcon(alert.status)

                      return (
                        <div
                          key={alert.id}
                          className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/20 transition-colors"
                        >
                          <Icon className={`h-5 w-5 mt-1 ${getSeverityColor(alert.severity)}`} />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-foreground">{alert.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {alert.fieldName}
                              </Badge>
                              <StatusBadge
                                status={
                                  alert.severity === "critical"
                                    ? "critical"
                                    : alert.severity === "medium"
                                    ? "warning"
                                    : "healthy"
                                }
                                size="sm"
                              />
                            </div>

                            <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{alert.timestamp.toLocaleString()}</span>
                              {alert.affectedArea > 0 && <span>Affected: {alert.affectedArea} acres</span>}
                              {alert.estimatedLoss > 0 && <span>Est. Loss: ${alert.estimatedLoss}</span>}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4 text-muted-foreground" />
                            {alert.status === "active" && (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAlertAction(alert.id, "Acknowledged")}
                                >
                                  Acknowledge
                                </Button>
                                <Button size="sm" onClick={() => handleAlertAction(alert.id, "Resolved")}>
                                  Resolve
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Notification Container */}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} position="top-right" />
    </div>
  )
}
