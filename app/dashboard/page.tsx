"use client"

import { cn } from "@/lib/utils"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { CropHealthMap } from "@/components/dashboard/crop-health-map"
import { SoilConditionCard } from "@/components/dashboard/soil-condition-card"
import { TrendPlot } from "@/components/dashboard/trend-plot"
import { RiskZoneChart } from "@/components/dashboard/risk-zone-chart"
import { MetricCard } from "@/components/agriculture/metric-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, Droplets, AlertTriangle, MapPin, RefreshCw } from "lucide-react"

// Mock data for demonstration
const mockCropHealthData = [
  {
    fieldId: "field-1",
    fieldName: "North Field",
    totalArea: 120,
    healthyArea: 95,
    warningArea: 20,
    criticalArea: 5,
    lastUpdated: new Date(),
    latitude: 40.7128, // New York City coordinates as example
    longitude: -74.0060,
    zones: [
      {
        id: "zone-1",
        name: "Zone A",
        x: 25,
        y: 30,
        status: "healthy" as const,
        type: "crop" as const,
        value: "NDVI: 0.85",
        details: "Optimal vegetation health",
        latitude: 40.7130,
        longitude: -74.0058,
      },
      {
        id: "zone-2",
        name: "Zone B",
        x: 60,
        y: 45,
        status: "warning" as const,
        type: "irrigation" as const,
        value: "Moisture: 35%",
        details: "Below optimal moisture levels",
        latitude: 40.7126,
        longitude: -74.0062,
      },
      {
        id: "zone-3",
        name: "Zone C",
        x: 80,
        y: 70,
        status: "critical" as const,
        type: "pest" as const,
        value: "Pest Risk: High",
        details: "Aphid infestation detected",
        latitude: 40.7124,
        longitude: -74.0064,
      },
    ],
  },
]

const mockSoilData = {
  fieldId: "field-1",
  fieldName: "North Field",
  location: "Section A-1",
  lastUpdated: new Date(),
  metrics: {
    moisture: {
      name: "Soil Moisture",
      value: 42,
      unit: "%",
      optimal: { min: 40, max: 60 },
      status: "good" as const,
      trend: { value: 5, isPositive: true },
    },
    ph: {
      name: "pH Level",
      value: 6.8,
      unit: "",
      optimal: { min: 6.0, max: 7.5 },
      status: "good" as const,
      trend: { value: -2, isPositive: false },
    },
    nitrogen: {
      name: "Nitrogen",
      value: 85,
      unit: "ppm",
      optimal: { min: 80, max: 120 },
      status: "good" as const,
    },
    phosphorus: {
      name: "Phosphorus",
      value: 45,
      unit: "ppm",
      optimal: { min: 30, max: 50 },
      status: "good" as const,
    },
    potassium: {
      name: "Potassium",
      value: 180,
      unit: "ppm",
      optimal: { min: 150, max: 200 },
      status: "good" as const,
    },
    temperature: {
      name: "Temperature",
      value: 22,
      unit: "°C",
      optimal: { min: 18, max: 25 },
      status: "good" as const,
    },
    conductivity: {
      name: "Conductivity",
      value: 1.2,
      unit: "dS/m",
      optimal: { min: 0.8, max: 1.5 },
      status: "good" as const,
    },
  },
}

const mockTrendData = [
  {
    metric: "Crop Health Index",
    unit: "NDVI",
    timeRange: "7d" as const,
    data: [
      { timestamp: "2024-01-01", actual: 0.75, predicted: 0.78 },
      { timestamp: "2024-01-02", actual: 0.78, predicted: 0.8 },
      { timestamp: "2024-01-03", actual: 0.82, predicted: 0.83 },
      { timestamp: "2024-01-04", actual: 0.85, predicted: 0.85 },
      { timestamp: "2024-01-05", actual: 0.83, predicted: 0.84 },
      { timestamp: "2024-01-06", actual: 0.87, predicted: 0.86 },
      { timestamp: "2024-01-07", actual: 0.89, predicted: 0.88 },
    ],
    prediction: {
      model: "LSTM" as const,
      accuracy: 94,
      nextValue: 0.91,
      trend: "increasing" as const,
      confidence: 87,
    },
    alerts: [
      {
        timestamp: "2024-01-06T10:30:00Z",
        type: "anomaly" as const,
        message: "Unexpected growth spike detected in Zone C",
      },
    ],
  },
]

const mockRiskData = [
  {
    fieldId: "field-1",
    fieldName: "North Field",
    totalRiskScore: 35,
    riskFactors: [
      {
        type: "pest" as const,
        name: "Aphid Infestation",
        severity: "medium" as const,
        probability: 65,
        impact: 40,
        affectedArea: 15,
        timeframe: "Next 7 days",
        mitigation: ["Beneficial insects", "Targeted spraying"],
      },
      {
        type: "weather" as const,
        name: "Drought Risk",
        severity: "low" as const,
        probability: 25,
        impact: 60,
        affectedArea: 120,
        timeframe: "Next 14 days",
        mitigation: ["Increase irrigation", "Mulching"],
      },
    ],
    historicalData: [
      { date: "2024-01-01", riskScore: 20, pestRisk: 15, weatherRisk: 10, diseaseRisk: 5 },
      { date: "2024-01-02", riskScore: 25, pestRisk: 20, weatherRisk: 15, diseaseRisk: 8 },
      { date: "2024-01-03", riskScore: 30, pestRisk: 25, weatherRisk: 20, diseaseRisk: 10 },
      { date: "2024-01-04", riskScore: 35, pestRisk: 30, weatherRisk: 18, diseaseRisk: 12 },
    ],
    recommendations: [
      {
        priority: "medium" as const,
        action: "Deploy beneficial insects for aphid control",
        timeframe: "Within 3 days",
        cost: 250,
      },
      {
        priority: "low" as const,
        action: "Monitor weather patterns for drought indicators",
        timeframe: "Ongoing",
        cost: 0,
      },
    ],
  },
]

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 md:ml-64 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Real-time agricultural monitoring and insights</p>
          </div>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Active Fields"
            value={12}
            icon={MapPin}
            trend={{ value: 8, isPositive: true }}
            status="good"
          />
          <MetricCard
            title="Crop Health"
            value={87}
            unit="%"
            icon={Leaf}
            trend={{ value: 3, isPositive: true }}
            status="good"
            progress={87}
          />
          <MetricCard
            title="Soil Moisture"
            value={42}
            unit="%"
            icon={Droplets}
            trend={{ value: -5, isPositive: false }}
            status="warning"
            progress={70}
          />
          <MetricCard title="Risk Alerts" value={3} icon={AlertTriangle} status="warning" />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Crop Health Map */}
          <div className="lg:col-span-2">
            <CropHealthMap 
              data={mockCropHealthData} 
              initialLatitude={mockCropHealthData[0]?.latitude}
              initialLongitude={mockCropHealthData[0]?.longitude}
            />
          </div>

          {/* Soil Conditions */}
          <SoilConditionCard data={mockSoilData} />

          {/* Risk Analysis */}
          <RiskZoneChart data={mockRiskData} />

          {/* Trend Analysis */}
          <div className="lg:col-span-2">
            <TrendPlot data={mockTrendData} />
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  time: "2 minutes ago",
                  action: "Irrigation system activated in North Field Zone B",
                  status: "info",
                },
                {
                  time: "15 minutes ago",
                  action: "Pest alert: Aphid infestation detected in Zone C",
                  status: "warning",
                },
                {
                  time: "1 hour ago",
                  action: "Soil moisture readings updated for all fields",
                  status: "success",
                },
                {
                  time: "3 hours ago",
                  action: "Weather forecast updated: Rain expected tomorrow",
                  status: "info",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      activity.status === "info" && "bg-blue-500",
                      activity.status === "warning" && "bg-yellow-500",
                      activity.status === "success" && "bg-primary",
                    )}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
