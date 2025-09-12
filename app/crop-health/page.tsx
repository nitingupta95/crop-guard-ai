"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CropHealthMap } from "@/components/dashboard/crop-health-map"
import { TrendPlot } from "@/components/dashboard/trend-plot"
import { MetricCard } from "@/components/agriculture/metric-card"
import { StatusBadge } from "@/components/agriculture/status-badge"
import { Download, AlertTriangle, TrendingUp, Leaf, Droplets } from "lucide-react"

// Mock CropHealthData type
type CropHealthData = {
  fieldId: string
  fieldName: string
  totalArea: number
  healthyArea: number
  warningArea: number
  criticalArea: number
  lastUpdated: Date
  zones: { id: string; name: string; x: number; y: number; status: "healthy" | "warning" | "critical"; type: string; value: string; details?: string }[]
}

export default function CropHealthPage() {
  const [timeRange, setTimeRange] = useState("7d")

  const cropHealthMetrics = [
    { title: "Overall Health Score", value: "87%", change: "+5%", trend: "up" as const, icon: Leaf, description: "Composite health index across all monitored fields" },
    { title: "Vegetation Index (NDVI)", value: "0.82", change: "+0.05", trend: "up" as const, icon: TrendingUp, description: "Normalized Difference Vegetation Index" },
    { title: "Stress Indicators", value: "12%", change: "-3%", trend: "down" as const, icon: AlertTriangle, description: "Areas showing signs of plant stress" },
    { title: "Water Stress", value: "8%", change: "-2%", trend: "down" as const, icon: Droplets, description: "Fields with moisture deficiency" },
  ]

  const fieldHealthData = [
    { id: "field-1", name: "North Field", health: 92, area: "45 acres", crop: "Corn", status: "healthy" },
    { id: "field-2", name: "South Field", health: 78, area: "38 acres", crop: "Soybeans", status: "warning" },
    { id: "field-3", name: "East Field", health: 85, area: "52 acres", crop: "Wheat", status: "healthy" },
    { id: "field-4", name: "West Field", health: 65, area: "41 acres", crop: "Corn", status: "critical" },
  ]

  const healthIssues = [
    { field: "South Field", issue: "Nutrient Deficiency", severity: "Medium", affected: "15%" },
    { field: "West Field", issue: "Pest Infestation", severity: "High", affected: "25%" },
    { field: "North Field", issue: "Water Stress", severity: "Low", affected: "5%" },
  ]

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
        { id: "zone-1", name: "Zone A", x: 10, y: 20, status: "healthy", type: "crop", value: "NDVI 0.82", details: "Healthy crop" },
        { id: "zone-2", name: "Zone B", x: 40, y: 30, status: "warning", type: "pest", value: "Pest Alert", details: "Mild infestation" },
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
        { id: "zone-3", name: "Zone C", x: 15, y: 25, status: "critical", type: "disease", value: "Fungal Infection" },
      ],
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crop Health Monitoring</h1>
          <p className="text-muted-foreground">Real-time crop health analysis and vegetation monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
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

      {/* Health Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cropHealthMetrics.map((metric, idx) => (
          <MetricCard
            key={idx}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            trend={metric.trend}
            icon={metric.icon}
            description={metric.description}
          />
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

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CropHealthMap data={mockCropHealthData} />
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

        {/* Spectral Analysis Tab */}
        <TabsContent value="spectral" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>NDVI Analysis</CardTitle>
                <CardDescription>Normalized Difference Vegetation Index over time</CardDescription>
              </CardHeader>
              <CardContent>
                <TrendPlot
                  title="NDVI Trends"
                  data={[
                    { date: "2024-01-01", value: 0.75, predicted: null },
                    { date: "2024-01-08", value: 0.78, predicted: null },
                    { date: "2024-01-15", value: 0.82, predicted: null },
                    { date: "2024-01-22", value: 0.8, predicted: null },
                    { date: "2024-01-29", value: 0.85, predicted: 0.87 },
                    { date: "2024-02-05", value: null, predicted: 0.89 },
                  ]}
                />
              </CardContent>
            </Card>

            <Card className="bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>Chlorophyll Content</CardTitle>
                <CardDescription>Leaf chlorophyll concentration indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <TrendPlot
                  title="Chlorophyll Index"
                  data={[
                    { date: "2024-01-01", value: 42, predicted: null },
                    { date: "2024-01-08", value: 45, predicted: null },
                    { date: "2024-01-15", value: 48, predicted: null },
                    { date: "2024-01-22", value: 46, predicted: null },
                    { date: "2024-01-29", value: 50, predicted: 52 },
                    { date: "2024-02-05", value: null, predicted: 54 },
                  ]}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle>Health Trend Analysis</CardTitle>
              <CardDescription>AI-powered predictions and historical trends</CardDescription>
            </CardHeader>
            <CardContent>
              <TrendPlot
                title="Overall Health Score Trends"
                data={[
                  { date: "2024-01-01", value: 82, predicted: null },
                  { date: "2024-01-08", value: 84, predicted: null },
                  { date: "2024-01-15", value: 87, predicted: null },
                  { date: "2024-01-22", value: 85, predicted: null },
                  { date: "2024-01-29", value: 89, predicted: 91 },
                  { date: "2024-02-05", value: null, predicted: 93 },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Issues Tab */}
        <TabsContent value="issues" className="space-y-4">
          <Card className="bg-card text-card-foreground">
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
                        issue.severity === "High" ? "destructive" : issue.severity === "Medium" ? "default" : "secondary"
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
    </div>
  )
}
