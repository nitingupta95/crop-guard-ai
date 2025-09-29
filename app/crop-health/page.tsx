"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { useUserLocation } from "@/hooks/use-user-location"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CropHealthMap } from "@/components/dashboard/crop-health-map"
import { TrendPlot } from "@/components/dashboard/trend-plot"
import { MetricCard } from "@/components/agriculture/metric-card"
import { StatusBadge } from "@/components/agriculture/status-badge"
import { Download, AlertTriangle, TrendingUp, Leaf, Droplets, LucideIcon } from "lucide-react"

// ------------------ Types ------------------
type ZoneType = "crop" | "pest" | "disease" | "irrigation" | "temperature"

type CropHealthData = {
  fieldId: string
  fieldName: string
  totalArea: number
  healthyArea: number
  warningArea: number
  criticalArea: number
  lastUpdated: Date
  zones: {
    id: string
    name: string
    x: number
    y: number
    status: "healthy" | "warning" | "critical"
    type: ZoneType
    value: string
    details?: string
  }[]
}

type FieldHealth = {
  id: string
  name: string
  health: number
  area: string
  crop: string
  status: "healthy" | "warning" | "critical"
}

type HealthIssue = {
  field: string
  issue: string
  severity: "Low" | "Medium" | "High"
  affected: string
}

export default function DashboardPage() {
  const { userLocation } = useUserLocation()
  const [timeRange, setTimeRange] = useState("7d")

  // ✅ MetricCard props fixed (trend + icon type)
  const cropHealthMetrics: {
    title: string
    value: string
    change: string
    trend: { value: number; isPositive: boolean }
    icon: LucideIcon
    description: string
  }[] = [
    {
      title: "Overall Health Score",
      value: "87%",
      change: "+5%",
      trend: { value: 5, isPositive: true },
      icon: Leaf,
      description: "Composite health index across all monitored fields",
    },
    {
      title: "Vegetation Index (NDVI)",
      value: "0.82",
      change: "+0.05",
      trend: { value: 6, isPositive: true },
      icon: TrendingUp,
      description: "Normalized Difference Vegetation Index",
    },
    {
      title: "Stress Indicators",
      value: "12%",
      change: "-3%",
      trend: { value: 3, isPositive: false },
      icon: AlertTriangle,
      description: "Areas showing signs of plant stress",
    },
    {
      title: "Water Stress",
      value: "8%",
      change: "-2%",
      trend: { value: 2, isPositive: false },
      icon: Droplets,
      description: "Fields with moisture deficiency",
    },
  ]

  const fieldHealthData: FieldHealth[] = [
    { id: "field-1", name: "North Field", health: 92, area: "45 acres", crop: "Corn", status: "healthy" },
    { id: "field-2", name: "South Field", health: 78, area: "38 acres", crop: "Soybeans", status: "warning" },
    { id: "field-3", name: "East Field", health: 85, area: "52 acres", crop: "Wheat", status: "healthy" },
    { id: "field-4", name: "West Field", health: 65, area: "41 acres", crop: "Corn", status: "critical" },
  ]

  const healthIssues: HealthIssue[] = [
    { field: "South Field", issue: "Nutrient Deficiency", severity: "Medium", affected: "15%" },
    { field: "West Field", issue: "Pest Infestation", severity: "High", affected: "25%" },
    { field: "North Field", issue: "Water Stress", severity: "Low", affected: "5%" },
  ]

  // ✅ Zone type restricted
  const mockCropHealthData: CropHealthData[] = [
    {
      fieldId: "field-1",
      fieldName: "North Field",
      totalArea: 50,
      healthyArea: 45,
      warningArea: 3,
      criticalArea: 2,
      lastUpdated: new Date(),
      zones: [
        {
          id: "zone-1",
          name: "Zone A",
          x: 10,
          y: 20,
          status: "healthy",
          type: "crop",
          value: "NDVI 0.82",
          details: "Healthy crop",
        },
        {
          id: "zone-2",
          name: "Zone B",
          x: 40,
          y: 30,
          status: "warning",
          type: "pest",
          value: "Pest Alert",
          details: "Mild infestation",
        },
      ],
    },
    {
      fieldId: "field-2",
      fieldName: "South Field",
      totalArea: 38,
      healthyArea: 30,
      warningArea: 5,
      criticalArea: 3,
      lastUpdated: new Date(),
      zones: [
        {
          id: "zone-3",
          name: "Zone C",
          x: 15,
          y: 25,
          status: "critical",
          type: "disease",
          value: "Fungal Infection",
        },
      ],
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content area */}
      <main className="flex-1 md:ml-64 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Crop Health Monitoring</h1>
            <p className="text-muted-foreground">Real-time crop health analysis and vegetation monitoring</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cropHealthMetrics.map((metric, idx) => (
            <MetricCard key={idx} {...metric} />
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Health Overview</TabsTrigger>
            <TabsTrigger value="spectral">Spectral Analysis</TabsTrigger>
            <TabsTrigger value="trends">Health Trends</TabsTrigger>
            <TabsTrigger value="issues">Health Issues</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <CropHealthMap 
                  data={mockCropHealthData} 
                  initialLatitude={userLocation?.latitude}
                  initialLongitude={userLocation?.longitude}
                />
              </div>
              <Card className="bg-card text-card-foreground">
                <CardHeader>
                  <CardTitle>Field Health Summary</CardTitle>
                  <CardDescription>Health scores by field</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fieldHealthData.map((field) => (
                    <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium">{field.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {field.crop} • {field.area}
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="font-bold text-lg">{field.health}%</div>
                        <StatusBadge status={field.status} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Spectral */}
          <TabsContent value="spectral" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>NDVI Analysis</CardTitle>
                  <CardDescription>Normalized Difference Vegetation Index over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <TrendPlot
                    data={[
                      {
                        metric: "NDVI",
                        unit: "index",
                        timeRange: timeRange as "24h" | "7d" | "30d" | "90d",
                        data: [
                          { timestamp: "2024-01-01", actual: 0.75 },
                          { timestamp: "2024-01-08", actual: 0.78 },
                          { timestamp: "2024-01-15", actual: 0.82 },
                          { timestamp: "2024-01-22", actual: 0.8 },
                          { timestamp: "2024-01-29", actual: 0.85, predicted: 0.87 },
                          { timestamp: "2024-02-05", actual: 0, predicted: 0.89 },
                        ],
                        prediction: {
                          model: "LSTM",
                          accuracy: 92,
                          nextValue: 0.9,
                          trend: "increasing",
                          confidence: 85,
                        },
                        alerts: [
                          {
                            timestamp: "2024-02-01",
                            type: "anomaly",
                            message: "NDVI dropped suddenly in South Field",
                          },
                        ],
                      },
                    ]}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Chlorophyll Content</CardTitle>
                  <CardDescription>Leaf chlorophyll concentration indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <TrendPlot
                    data={[
                      {
                        metric: "Chlorophyll",
                        unit: "µg/cm²",
                        timeRange: timeRange as "24h" | "7d" | "30d" | "90d",
                        data: [
                          { timestamp: "2024-01-01", actual: 42 },
                          { timestamp: "2024-01-08", actual: 45 },
                          { timestamp: "2024-01-15", actual: 48 },
                          { timestamp: "2024-01-22", actual: 46 },
                          { timestamp: "2024-01-29", actual: 50, predicted: 52 },
                          { timestamp: "2024-02-05", actual: 0, predicted: 54 },
                        ],
                        prediction: {
                          model: "CNN",
                          accuracy: 88,
                          nextValue: 55,
                          trend: "increasing",
                          confidence: 80,
                        },
                      },
                    ]}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends */}
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Health Trend Analysis</CardTitle>
                <CardDescription>AI-powered predictions and historical trends</CardDescription>
              </CardHeader>
              <CardContent>
                <TrendPlot
                  data={[
                    {
                      metric: "Overall Health Score",
                      unit: "%",
                      timeRange: timeRange as "24h" | "7d" | "30d" | "90d",
                      data: [
                        { timestamp: "2024-01-01", actual: 82 },
                        { timestamp: "2024-01-08", actual: 84 },
                        { timestamp: "2024-01-15", actual: 87 },
                        { timestamp: "2024-01-22", actual: 85 },
                        { timestamp: "2024-01-29", actual: 89, predicted: 91 },
                        { timestamp: "2024-02-05", actual: 0, predicted: 93 },
                      ],
                      prediction: {
                        model: "LSTM",
                        accuracy: 91,
                        nextValue: 93,
                        trend: "increasing",
                        confidence: 86,
                      },
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Issues */}
          <TabsContent value="issues" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Health Issues & Alerts</CardTitle>
                <CardDescription>Current health problems requiring attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {healthIssues.map((issue, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{issue.field}</div>
                      <div className="text-sm text-muted-foreground">{issue.issue}</div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge
                        variant={
                          issue.severity === "High"
                            ? "destructive"
                            : issue.severity === "Medium"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {issue.severity}
                      </Badge>
                      <div className="text-sm text-muted-foreground">{issue.affected} affected</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
