"use client"

import { useState } from "react"
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Zap,
  Droplet,
  Sprout,
  DollarSign, 
  Download,
} from "lucide-react"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { MetricCard } from "@/components/agriculture/metric-card"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  const yieldData = [
    { month: "Jan", actual: 45, predicted: 48, target: 50 },
    { month: "Feb", actual: 52, predicted: 50, target: 55 },
    { month: "Mar", actual: 58, predicted: 55, target: 60 },
    { month: "Apr", actual: 62, predicted: 60, target: 65 },
    { month: "May", actual: 68, predicted: 65, target: 70 },
    { month: "Jun", actual: 72, predicted: 70, target: 75 },
  ]

  const cropDistribution = [
    { name: "Rice", value: 40, color: "#22c55e" },
    { name: "Wheat", value: 30, color: "#3b82f6" },
    { name: "Corn", value: 20, color: "#f59e0b" },
    { name: "Soybeans", value: 10, color: "#8b5cf6" },
  ]

  const performanceMetrics = [
    {
      title: "Yield Efficiency",
      value: 92,
      unit: "%",
      trend: { value: 4.2, isPositive: true },
      icon: Sprout,
    },
    {
      title: "Water Usage",
      value: 1200,
      unit: "L/ha",
      trend: { value: 8.1, isPositive: false },
      icon: Droplet,
    },
    {
      title: "Energy Efficiency",
      value: 87,
      unit: "%",
      trend: { value: 3.4, isPositive: true },
      icon: Zap,
    },
    {
      title: "Revenue/ha",
      value: 1450,
      unit: "$",
      trend: { value: 12.5, isPositive: true },
      icon: DollarSign,
    },
  ]

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div className="flex-1 bg-muted/40 p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive farm performance analytics and insights
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="rounded-lg shadow-sm">
              <Download className="mr-2 h-4 w-4" />
              Export Analytics
            </Button>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-36 rounded-lg">
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {performanceMetrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              unit={metric.unit}
              trend={metric.trend}
              icon={metric.icon}
              className="rounded-xl shadow-md border bg-card"
            />
          ))}
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="yield" className="space-y-6">
          <TabsList className="bg-card shadow-sm rounded-lg p-1">
            <TabsTrigger value="yield" className="rounded-md">
              Yield Analysis
            </TabsTrigger>
            <TabsTrigger value="financial" className="rounded-md">
              Financial Metrics
            </TabsTrigger>
            <TabsTrigger value="efficiency" className="rounded-md">
              Efficiency Analysis
            </TabsTrigger>
            <TabsTrigger value="comparison" className="rounded-md">
              Field Comparison
            </TabsTrigger>
          </TabsList>

          {/* Yield Analysis */}
          <TabsContent value="yield" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Yield Prediction Chart */}
              <Card className="lg:col-span-2 rounded-xl shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">
                    Yield Prediction vs Actual
                  </CardTitle>
                  <CardDescription>
                    AI-powered yield forecasting accuracy
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={yieldData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="#22c55e"
                        strokeWidth={2}
                        name="Actual Yield"
                      />
                      <Line
                        type="monotone"
                        dataKey="predicted"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Predicted Yield"
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        strokeDasharray="10 5"
                        name="Target Yield"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Crop Distribution */}
              <Card className="rounded-xl shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">
                    Crop Distribution
                  </CardTitle>
                  <CardDescription>Acreage by crop type</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={cropDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        dataKey="value"
                      >
                        {cropDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-6 space-y-3">
                    {cropDistribution.map((crop, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: crop.color }}
                          />
                          <span className="text-sm">{crop.name}</span>
                        </div>
                        <span className="text-sm font-semibold">
                          {crop.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
