"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { cn } from "@/lib/utils"
import type { TooltipProps } from "recharts"
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent"

interface ChartDataPoint {
  name: string
  value: number
  secondary?: number
}

interface AnimatedChartProps {
  title: string
  data: ChartDataPoint[]
  type?: "line" | "area"
  color?: string
  secondaryColor?: string
  height?: number
  className?: string
  showGrid?: boolean
  animate?: boolean
}

export function AnimatedChart({
  title,
  data,
  type = "line",
  color = "hsl(var(--primary))",
  secondaryColor = "hsl(var(--secondary))",
  height = 300,
  className,
  showGrid = true,
  animate = true,
}: AnimatedChartProps) {
  const [animatedData, setAnimatedData] = useState<ChartDataPoint[]>([])

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setAnimatedData(data)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setAnimatedData(data)
    }
  }, [data, animate])

  // ✅ Strongly typed custom tooltip
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const chartProps = {
    data: animatedData,
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
  }

  return (
    <Card className={cn("transition-all duration-300", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {type === "area" ? (
            <AreaChart {...chartProps}>
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              )}
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fill={color}
                fillOpacity={0.1}
                strokeWidth={2}
                animationDuration={animate ? 1500 : 0}
              />
              {animatedData[0]?.secondary !== undefined && (
                <Area
                  type="monotone"
                  dataKey="secondary"
                  stroke={secondaryColor}
                  fill={secondaryColor}
                  fillOpacity={0.1}
                  strokeWidth={2}
                  animationDuration={animate ? 1500 : 0}
                />
              )}
            </AreaChart>
          ) : (
            <LineChart {...chartProps}>
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              )}
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
                animationDuration={animate ? 1500 : 0}
              />
              {animatedData[0]?.secondary !== undefined && (
                <Line
                  type="monotone"
                  dataKey="secondary"
                  stroke={secondaryColor}
                  strokeWidth={2}
                  dot={{ fill: secondaryColor, strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    stroke: secondaryColor,
                    strokeWidth: 2,
                  }}
                  animationDuration={animate ? 1500 : 0}
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
