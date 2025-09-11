"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  unit?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  status?: "good" | "warning" | "critical"
  progress?: number
  className?: string
  onClick?: () => void
}

export function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  status = "good",
  progress,
  className,
  onClick,
}: MetricCardProps) {
  const statusColors = {
    good: "text-primary border-primary/20 bg-primary/5",
    warning:
      "text-yellow-600 border-yellow-200 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-800 dark:bg-yellow-900/20",
    critical: "text-destructive border-destructive/20 bg-destructive/5",
  }

  const trendColors = trend?.isPositive ? "text-primary" : "text-destructive"

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md cursor-pointer group",
        statusColors[status],
        className,
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>

          {trend && (
            <div className="flex items-center gap-1">
              <span className={cn("text-xs font-medium", trendColors)}>
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">vs last week</span>
            </div>
          )}

          {progress !== undefined && (
            <div className="space-y-1">
              <Progress value={progress} className="h-2" />
              <span className="text-xs text-muted-foreground">{progress}% optimal</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
