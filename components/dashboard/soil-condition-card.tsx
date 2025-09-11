"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MetricCard } from "@/components/agriculture/metric-card"
import { StatusBadge } from "@/components/agriculture/status-badge"
import { Droplets, Thermometer, Zap, TestTube } from "lucide-react"
import { cn } from "@/lib/utils"

interface SoilMetric {
  name: string
  value: number
  unit: string
  optimal: { min: number; max: number }
  status: "good" | "warning" | "critical"
  trend?: {
    value: number
    isPositive: boolean
  }
}

interface SoilConditionData {
  fieldId: string
  fieldName: string
  location: string
  lastUpdated: Date
  metrics: {
    moisture: SoilMetric
    ph: SoilMetric
    nitrogen: SoilMetric
    phosphorus: SoilMetric
    potassium: SoilMetric
    temperature: SoilMetric
    conductivity: SoilMetric
  }
}

interface SoilConditionCardProps {
  data: SoilConditionData
  compact?: boolean
  className?: string
}

export function SoilConditionCard({ data, compact = false, className }: SoilConditionCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getStatusFromValue = (
    value: number,
    optimal: { min: number; max: number },
  ): "good" | "warning" | "critical" => {
    if (value >= optimal.min && value <= optimal.max) return "good"
    if (value >= optimal.min * 0.8 && value <= optimal.max * 1.2) return "warning"
    return "critical"
  }

  const getProgressValue = (value: number, optimal: { min: number; max: number }): number => {
    const range = optimal.max - optimal.min
    const normalizedValue = Math.max(0, Math.min(100, ((value - optimal.min) / range) * 100))
    return normalizedValue
  }

  const primaryMetrics = [
    { key: "moisture", icon: Droplets, label: "Soil Moisture" },
    { key: "ph", icon: TestTube, label: "pH Level" },
    { key: "temperature", icon: Thermometer, label: "Temperature" },
    { key: "nitrogen", icon: Zap, label: "Nitrogen" },
  ]

  const secondaryMetrics = [
    { key: "phosphorus", icon: Zap, label: "Phosphorus" },
    { key: "potassium", icon: Zap, label: "Potassium" },
    { key: "conductivity", icon: Zap, label: "Conductivity" },
  ]

  if (compact) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{data.fieldName}</CardTitle>
            <StatusBadge
              status={
                data.metrics.moisture.status === "good"
                  ? "healthy"
                  : data.metrics.moisture.status === "warning"
                    ? "warning"
                    : "critical"
              }
            />
          </div>
          <p className="text-sm text-muted-foreground">{data.location}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {primaryMetrics.slice(0, 2).map(({ key, icon: Icon, label }) => {
            const metric = data.metrics[key as keyof typeof data.metrics]
            return (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {metric.value}
                    {metric.unit}
                  </span>
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      metric.status === "good" && "bg-primary",
                      metric.status === "warning" && "bg-yellow-500",
                      metric.status === "critical" && "bg-destructive",
                    )}
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Soil Conditions</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {data.fieldName} • {data.location}
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            Updated {data.lastUpdated.toLocaleTimeString()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {primaryMetrics.map(({ key, icon, label }) => {
            const metric = data.metrics[key as keyof typeof data.metrics]
            return (
              <MetricCard
                key={key}
                title={label}
                value={metric.value}
                unit={metric.unit}
                icon={icon}
                status={metric.status}
                trend={metric.trend}
                progress={getProgressValue(metric.value, metric.optimal)}
              />
            )
          })}
        </div>

        {/* Secondary Metrics */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Additional Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {secondaryMetrics.map(({ key, icon: Icon, label }) => {
              const metric = data.metrics[key as keyof typeof data.metrics]
              return (
                <div key={key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {metric.value}
                      {metric.unit}
                    </span>
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        metric.status === "good" && "bg-primary",
                        metric.status === "warning" && "bg-yellow-500",
                        metric.status === "critical" && "bg-destructive",
                      )}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Optimal Ranges */}
        <div className="p-4 bg-muted/20 rounded-lg">
          <h4 className="text-sm font-medium mb-3">Optimal Ranges</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {Object.entries(data.metrics).map(([key, metric]) => (
              <div key={key} className="flex justify-between">
                <span className="text-muted-foreground capitalize">{key}:</span>
                <span>
                  {metric.optimal.min} - {metric.optimal.max} {metric.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
