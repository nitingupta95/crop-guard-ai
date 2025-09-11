"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedChart } from "@/components/agriculture/animated-chart"
import { Calendar, TrendingUp, TrendingDown, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrendDataPoint {
  timestamp: string
  actual: number
  predicted?: number
  confidence?: number
}

interface TrendPlotData {
  metric: string
  unit: string
  timeRange: "24h" | "7d" | "30d" | "90d"
  data: TrendDataPoint[]
  prediction: {
    model: "LSTM" | "CNN" | "Hybrid"
    accuracy: number
    nextValue: number
    trend: "increasing" | "decreasing" | "stable"
    confidence: number
  }
  alerts?: Array<{
    timestamp: string
    type: "anomaly" | "threshold" | "prediction"
    message: string
  }>
}

type TimeRange = "24h" | "7d" | "30d" | "90d"

interface TrendPlotProps {
  data: TrendPlotData[]
  selectedMetric?: string
  onMetricChange?: (metric: string) => void
  className?: string
}

export function TrendPlot({ data, selectedMetric, onMetricChange, className }: TrendPlotProps) {
  const [activeMetric, setActiveMetric] = useState(selectedMetric || data[0]?.metric)
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")

  const currentData = data.find((d) => d.metric === activeMetric)
  if (!currentData) return null

  const chartData = currentData.data.map((point) => ({
    name: new Date(point.timestamp).toLocaleDateString(),
    value: point.actual,
    secondary: point.predicted,
  }))

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return TrendingUp
      case "decreasing":
        return TrendingDown
      default:
        return Activity
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "text-primary"
      case "decreasing":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const handleMetricChange = (metric: string) => {
    setActiveMetric(metric)
    onMetricChange?.(metric)
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Trend Analysis & Predictions</CardTitle>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Metric Selection */}
        <div className="flex flex-wrap gap-2">
          {data.map((item) => (
            <Button
              key={item.metric}
              variant={activeMetric === item.metric ? "default" : "outline"}
              size="sm"
              onClick={() => handleMetricChange(item.metric)}
            >
              {item.metric}
            </Button>
          ))}
        </div>

        {/* Tabs for Time Range + Chart + Summary */}
        <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
          <TabsList className="grid w-fit grid-cols-4">
            <TabsTrigger value="24h">24H</TabsTrigger>
            <TabsTrigger value="7d">7D</TabsTrigger>
            <TabsTrigger value="30d">30D</TabsTrigger>
            <TabsTrigger value="90d">90D</TabsTrigger>
          </TabsList>

          <TabsContent value={timeRange} className="space-y-4">
            {/* Prediction Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {currentData.prediction.model} Model
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {currentData.prediction.accuracy}% accuracy
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {currentData.prediction.nextValue.toFixed(1)}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    {currentData.unit}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Predicted next value</p>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    const Icon = getTrendIcon(currentData.prediction.trend)
                    return (
                      <Icon
                        className={cn("h-4 w-4", getTrendColor(currentData.prediction.trend))}
                      />
                    )
                  })()}
                  <span className="text-sm font-medium capitalize">
                    {currentData.prediction.trend}
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {currentData.prediction.confidence}%
                </div>
                <p className="text-sm text-muted-foreground">Confidence level</p>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Alerts</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {currentData.alerts?.length || 0}
                </div>
                <p className="text-sm text-muted-foreground">Active anomalies</p>
              </div>
            </div>

            {/* Chart */}
            <AnimatedChart
              title={`${currentData.metric} Trends (${timeRange})`}
              data={chartData}
              type="line"
              height={300}
              color="hsl(var(--primary))"
              secondaryColor="hsl(var(--secondary))"
            />

            {/* Alerts */}
            {currentData.alerts && currentData.alerts.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recent Alerts</h4>
                <div className="space-y-2">
                  {currentData.alerts.slice(0, 3).map((alert, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg"
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          alert.type === "anomaly" && "bg-destructive",
                          alert.type === "threshold" && "bg-yellow-500",
                          alert.type === "prediction" && "bg-blue-500"
                        )}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs capitalize">
                        {alert.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
