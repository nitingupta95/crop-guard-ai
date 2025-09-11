"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AnimatedChart } from "@/components/agriculture/animated-chart"
import { AlertTriangle, Bug, Droplets, Thermometer, Wind, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

interface RiskFactor {
  type: "pest" | "disease" | "weather" | "irrigation" | "nutrient"
  name: string
  severity: "low" | "medium" | "high" | "critical"
  probability: number
  impact: number
  affectedArea: number
  timeframe: string
  mitigation?: string[]
}

interface RiskZoneData {
  fieldId: string
  fieldName: string
  totalRiskScore: number
  riskFactors: RiskFactor[]
  historicalData: Array<{
    date: string
    riskScore: number
    pestRisk: number
    weatherRisk: number
    diseaseRisk: number
  }>
  recommendations: Array<{
    priority: "high" | "medium" | "low"
    action: string
    timeframe: string
    cost?: number
  }>
}

interface RiskZoneChartProps {
  data: RiskZoneData[]
  selectedField?: string
  onFieldChange?: (fieldId: string) => void
  className?: string
}

export function RiskZoneChart({ data, selectedField, onFieldChange, className }: RiskZoneChartProps) {
  const [activeField, setActiveField] = useState(selectedField || data[0]?.fieldId)
  const [filterSeverity, setFilterSeverity] = useState<string>("all")

  const currentData = data.find((d) => d.fieldId === activeField)

  if (!currentData) return null

  const getRiskIcon = (type: RiskFactor["type"]) => {
    switch (type) {
      case "pest":
        return Bug
      case "disease":
        return AlertTriangle
      case "weather":
        return Wind
      case "irrigation":
        return Droplets
      case "nutrient":
        return Thermometer
      default:
        return AlertTriangle
    }
  }

  const getSeverityColor = (severity: RiskFactor["severity"]) => {
    switch (severity) {
      case "low":
        return "text-primary border-primary bg-primary/10"
      case "medium":
        return "text-yellow-600 border-yellow-500 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20"
      case "high":
        return "text-orange-600 border-orange-500 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20"
      case "critical":
        return "text-destructive border-destructive bg-destructive/10"
    }
  }

  const getRiskScoreColor = (score: number) => {
    if (score <= 30) return "text-primary"
    if (score <= 60) return "text-yellow-600 dark:text-yellow-400"
    if (score <= 80) return "text-orange-600 dark:text-orange-400"
    return "text-destructive"
  }

  const filteredRiskFactors =
    filterSeverity === "all"
      ? currentData.riskFactors
      : currentData.riskFactors.filter((factor) => factor.severity === filterSeverity)

  const chartData = currentData.historicalData.map((point) => ({
    name: new Date(point.date).toLocaleDateString(),
    value: point.riskScore,
    secondary: point.pestRisk,
    tertiary: point.weatherRisk,
  }))

  const handleFieldChange = (fieldId: string) => {
    setActiveField(fieldId)
    onFieldChange?.(fieldId)
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Risk Zone Analysis</CardTitle>
          <CardAction>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Field Selection */}
        <div className="flex flex-wrap gap-2">
          {data.map((field) => (
            <Button
              key={field.fieldId}
              variant={activeField === field.fieldId ? "default" : "outline"}
              size="sm"
              onClick={() => handleFieldChange(field.fieldId)}
              className="flex items-center gap-2"
            >
              {field.fieldName}
              <Badge variant="outline" className={cn("text-xs", getRiskScoreColor(field.totalRiskScore))}>
                {field.totalRiskScore}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Overall Risk Score */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Overall Risk Score</h3>
                <Badge variant="outline" className={cn("text-sm", getRiskScoreColor(currentData.totalRiskScore))}>
                  {currentData.totalRiskScore}/100
                </Badge>
              </div>
              <Progress value={currentData.totalRiskScore} className="h-3 mb-2" />
              <p className="text-sm text-muted-foreground">
                {currentData.totalRiskScore <= 30 && "Low risk - Continue monitoring"}
                {currentData.totalRiskScore > 30 &&
                  currentData.totalRiskScore <= 60 &&
                  "Moderate risk - Consider preventive measures"}
                {currentData.totalRiskScore > 60 &&
                  currentData.totalRiskScore <= 80 &&
                  "High risk - Take immediate action"}
                {currentData.totalRiskScore > 80 && "Critical risk - Emergency response required"}
              </p>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="text-sm font-medium mb-3">Active Risks</h4>
            <div className="space-y-2">
              {["critical", "high", "medium"].map((severity) => {
                const count = currentData.riskFactors.filter((f) => f.severity === severity).length
                return count > 0 ? (
                  <div key={severity} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{severity}</span>
                    <Badge variant="outline" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                ) : null
              })}
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Risk Factors</h3>
            <div className="flex gap-2">
              {["all", "critical", "high", "medium", "low"].map((severity) => (
                <Button
                  key={severity}
                  variant={filterSeverity === severity ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterSeverity(severity)}
                  className="capitalize"
                >
                  {severity}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            {filteredRiskFactors.map((factor, index) => {
              const Icon = getRiskIcon(factor.type)
              return (
                <div key={index} className="p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{factor.name}</h4>
                        <p className="text-sm text-muted-foreground capitalize">
                          {factor.type} • {factor.timeframe}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("text-xs", getSeverityColor(factor.severity))}>
                      {factor.severity}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Probability</p>
                      <div className="flex items-center gap-2">
                        <Progress value={factor.probability} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{factor.probability}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Impact</p>
                      <div className="flex items-center gap-2">
                        <Progress value={factor.impact} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{factor.impact}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Affected Area</p>
                      <p className="text-sm font-medium">{factor.affectedArea} acres</p>
                    </div>
                  </div>

                  {factor.mitigation && factor.mitigation.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Mitigation Options:</p>
                      <div className="flex flex-wrap gap-1">
                        {factor.mitigation.map((option, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {option}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Historical Risk Chart */}
        <AnimatedChart
          title="Risk Score History"
          data={chartData}
          type="area"
          height={250}
          color="hsl(var(--destructive))"
          secondaryColor="hsl(var(--chart-2))"
        />

        {/* Recommendations */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Recommended Actions</h3>
          <div className="space-y-2">
            {currentData.recommendations.slice(0, 3).map((rec, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    rec.priority === "high" && "bg-destructive",
                    rec.priority === "medium" && "bg-yellow-500",
                    rec.priority === "low" && "bg-primary",
                  )}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{rec.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {rec.timeframe} {rec.cost && `• Est. cost: $${rec.cost}`}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs capitalize">
                  {rec.priority}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
