"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { TrendPlot } from "@/components/dashboard/trend-plot"
import { MetricCard } from "@/components/agriculture/metric-card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, Download, Target, Zap, DollarSign } from "lucide-react"

 

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  // Mock analytics data
  const performanceMetrics = [
    {
      title: "Predicted Yield",
      value: "145 bu/ac",
      change: "+12%",
      trend: { value: 12, isPositive: true },
      icon: Target,
      description: "Expected harvest yield based on AI models",
    },
    {
      title: "Efficiency Score",
      value: "92%",
      change: "+8%",
      trend: { value: 8, isPositive: true },
      icon: Zap,
      description: "Overall operational efficiency rating",
    },
    {
      title: "Cost per Acre",
      value: "$485",
      change: "-5%",
      trend: { value: 5, isPositive: false },
      icon: DollarSign,
      description: "Average production cost per acre",
    },
    {
      title: "ROI Projection",
      value: "18.5%",
      change: "+3.2%",
      trend: { value: 3.2, isPositive: true },
      icon: TrendingUp,
      description: "Projected return on investment",
    },
  ]

  const yieldData = [
    { month: "Jan", actual: 0, predicted: 0, target: 0 },
    { month: "Feb", actual: 0, predicted: 0, target: 0 },
    { month: "Mar", actual: 15, predicted: 18, target: 20 },
    { month: "Apr", actual: 35, predicted: 38, target: 40 },
    { month: "May", actual: 65, predicted: 68, target: 70 },
    { month: "Jun", actual: 95, predicted: 98, target: 100 },
    { month: "Jul", actual: 125, predicted: 128, target: 130 },
    { month: "Aug", actual: 145, predicted: 148, target: 150 },
    { month: "Sep", actual: null, predicted: 155, target: 160 },
    { month: "Oct", actual: null, predicted: 145, target: 150 },
  ]

  const cropDistribution = [
    { name: "Corn", value: 45, color: "#22c55e" },
    { name: "Soybeans", value: 30, color: "#3b82f6" },
    { name: "Wheat", value: 20, color: "#f59e0b" },
    { name: "Other", value: 5, color: "#8b5cf6" },
  ]

  const costBreakdown = [
    { category: "Seeds", amount: 125, percentage: 26 },
    { category: "Fertilizer", amount: 145, percentage: 30 },
    { category: "Pesticides", amount: 85, percentage: 17 },
    { category: "Fuel", amount: 65, percentage: 13 },
    { category: "Labor", amount: 45, percentage: 9 },
    { category: "Equipment", amount: 25, percentage: 5 },
  ]

  const fieldPerformance = [
    { field: "North Field", yield: 152, efficiency: 94, cost: 465, roi: 22.1 },
    { field: "South Field", yield: 138, efficiency: 87, cost: 495, roi: 16.8 },
    { field: "East Field", yield: 145, efficiency: 91, cost: 475, roi: 19.2 },
    { field: "West Field", yield: 132, efficiency: 83, cost: 515, roi: 14.5 },
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive farm performance analytics and insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Analytics
          </Button>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {performanceMetrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            trend={metric.trend} 
            icon={metric.icon}
            description={metric.description}
          />
        ))}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="yield" className="space-y-4">
        <TabsList>
          <TabsTrigger value="yield">Yield Analysis</TabsTrigger>
          <TabsTrigger value="financial">Financial Metrics</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Field Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="yield" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Yield Prediction vs Actual</CardTitle>
                  <CardDescription>AI-powered yield forecasting accuracy</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={yieldData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={2} name="Actual Yield" />
                      <Line type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Predicted Yield" />
                      <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="10 5" name="Target Yield" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Crop Distribution</CardTitle>
                <CardDescription>Acreage by crop type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={cropDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                      {cropDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {cropDistribution.map((crop, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: crop.color }} />
                        <span className="text-sm">{crop.name}</span>
                      </div>
                      <span className="text-sm font-medium">{crop.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>Production costs by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={costBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
                <CardDescription>Detailed cost breakdown per acre</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {costBreakdown.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.category}</span>
                      <span className="font-medium">${item.amount}/acre</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                    <div className="text-xs text-muted-foreground text-right">{item.percentage}% of total cost</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operational Efficiency Trends</CardTitle>
              <CardDescription>Efficiency metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <TrendPlot
                title="Efficiency Score"
                data={}
              /> */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Field Performance Comparison</CardTitle>
              <CardDescription>Comparative analysis across all fields</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fieldPerformance.map((field, index) => (
                  <div key={index} className="grid grid-cols-5 gap-4 p-4 border rounded-lg">
                    <div className="font-medium">{field.field}</div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Yield</div>
                      <div className="font-bold">{field.yield} bu/ac</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Efficiency</div>
                      <div className="font-bold">{field.efficiency}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Cost</div>
                      <div className="font-bold">${field.cost}/ac</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">ROI</div>
                      <div className="font-bold">{field.roi}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
