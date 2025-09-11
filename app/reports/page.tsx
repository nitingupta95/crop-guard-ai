"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AnimatedChart } from "@/components/agriculture/animated-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Share, Calendar, TrendingUp, BarChart3, Activity } from "lucide-react"

const mockReportData = {
  summary: {
    totalFields: 12,
    totalAcres: 1250,
    averageCropHealth: 78,
    totalYieldPrediction: 2340,
    activeAlerts: 8,
    resolvedIssues: 23,
  },
  cropHealthTrend: [
    { name: "Jan", value: 72, secondary: 70 },
    { name: "Feb", value: 75, secondary: 73 },
    { name: "Mar", value: 78, secondary: 76 },
    { name: "Apr", value: 82, secondary: 80 },
    { name: "May", value: 85, secondary: 83 },
    { name: "Jun", value: 78, secondary: 81 },
  ],
  yieldPrediction: [
    { name: "Corn", value: 185, secondary: 180 },
    { name: "Soybeans", value: 52, secondary: 48 },
    { name: "Wheat", value: 68, secondary: 65 },
    { name: "Barley", value: 45, secondary: 42 },
  ],
  riskAnalysis: [
    { name: "Pest Risk", value: 25 },
    { name: "Disease Risk", value: 15 },
    { name: "Weather Risk", value: 35 },
    { name: "Irrigation Risk", value: 20 },
    { name: "Nutrient Risk", value: 10 },
  ],
}

const reportTemplates = [
  {
    id: "weekly",
    name: "Weekly Summary",
    description: "Comprehensive weekly overview of all fields and metrics",
    lastGenerated: "2024-01-15",
    status: "ready",
  },
  {
    id: "monthly",
    name: "Monthly Analysis",
    description: "Detailed monthly performance analysis and trends",
    lastGenerated: "2024-01-01",
    status: "ready",
  },
  {
    id: "seasonal",
    name: "Seasonal Report",
    description: "Season-end comprehensive analysis and yield summary",
    lastGenerated: "2023-12-01",
    status: "pending",
  },
  {
    id: "custom",
    name: "Custom Report",
    description: "Generate custom reports with selected metrics and date ranges",
    lastGenerated: null,
    status: "available",
  },
]

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState("weekly")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = async (reportId: string) => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
  }

  const handleDownloadReport = (format: string) => {
    console.log(`Downloading report in ${format} format`)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 md:ml-64 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">Generate comprehensive reports and analyze agricultural performance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Report Templates */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold">Report Templates</h2>

            <div className="space-y-3">
              {reportTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedReport === template.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedReport(template.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <Badge
                        variant={
                          template.status === "ready"
                            ? "default"
                            : template.status === "pending"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {template.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {template.lastGenerated && (
                      <p className="text-xs text-muted-foreground">
                        Last generated: {new Date(template.lastGenerated).toLocaleDateString()}
                      </p>
                    )}
                    <Button
                      size="sm"
                      className="w-full mt-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleGenerateReport(template.id)
                      }}
                      disabled={isGenerating}
                    >
                      {isGenerating ? "Generating..." : "Generate"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Report Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{mockReportData.summary.totalFields}</p>
                      <p className="text-sm text-muted-foreground">Active Fields</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Activity className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{mockReportData.summary.totalAcres}</p>
                      <p className="text-sm text-muted-foreground">Total Acres</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{mockReportData.summary.averageCropHealth}%</p>
                      <p className="text-sm text-muted-foreground">Avg Health</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Report Content Tabs */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{reportTemplates.find((t) => t.id === selectedReport)?.name} Report</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleDownloadReport("pdf")}>
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownloadReport("excel")}>
                      <Download className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="trends">Trends</TabsTrigger>
                    <TabsTrigger value="yield">Yield Analysis</TabsTrigger>
                    <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Performance Summary</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                            <span className="text-sm font-medium">Total Yield Prediction</span>
                            <span className="font-bold">{mockReportData.summary.totalYieldPrediction} bu</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                            <span className="text-sm font-medium">Active Alerts</span>
                            <Badge variant="outline">{mockReportData.summary.activeAlerts}</Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                            <span className="text-sm font-medium">Resolved Issues</span>
                            <Badge variant="outline">{mockReportData.summary.resolvedIssues}</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Key Insights</h3>
                        <div className="space-y-3 text-sm">
                          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                            <p className="font-medium text-primary">Positive Trend</p>
                            <p className="text-muted-foreground">Crop health improved by 12% compared to last month</p>
                          </div>
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800">
                            <p className="font-medium text-yellow-600 dark:text-yellow-400">Attention Needed</p>
                            <p className="text-muted-foreground">Irrigation efficiency could be improved in 3 fields</p>
                          </div>
                          <div className="p-3 bg-muted/20 rounded-lg">
                            <p className="font-medium">Recommendation</p>
                            <p className="text-muted-foreground">Consider pest management program for optimal yield</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="trends">
                    <AnimatedChart
                      title="Crop Health Trends (6 Months)"
                      data={mockReportData.cropHealthTrend}
                      type="line"
                      height={400}
                    />
                  </TabsContent>

                  <TabsContent value="yield">
                    <AnimatedChart
                      title="Yield Predictions by Crop Type"
                      data={mockReportData.yieldPrediction}
                      type="area"
                      height={400}
                    />
                  </TabsContent>

                  <TabsContent value="risks">
                    <AnimatedChart
                      title="Risk Distribution Analysis"
                      data={mockReportData.riskAnalysis}
                      type="area"
                      height={400}
                      color="hsl(var(--destructive))"
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
