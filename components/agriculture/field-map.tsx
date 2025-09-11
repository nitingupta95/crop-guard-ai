"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Zap, Droplets, Bug, Thermometer } from "lucide-react"
import { cn } from "@/lib/utils"

type FieldZone = {
  id: string
  name: string
  x: number
  y: number
  status: "healthy" | "warning" | "critical"
  type: "crop" | "irrigation" | "pest" | "temperature" | "disease"  
  value: string
  details?: string
}

interface FieldMapProps {
  fieldName: string
  zones: FieldZone[]
  onZoneClick?: (zone: FieldZone) => void
  className?: string
}

export function FieldMap({ fieldName, zones, onZoneClick, className }: FieldMapProps) {
  const [selectedZone, setSelectedZone] = useState<FieldZone | null>(null)
  const [animatedZones, setAnimatedZones] = useState<FieldZone[]>([])

  useEffect(() => {
    // Animate zones appearing one by one
    zones.forEach((zone, index) => {
      setTimeout(() => {
        setAnimatedZones((prev) => [...prev, zone])
      }, index * 200)
    })
  }, [zones])

  const getZoneIcon = (type: FieldZone["type"]) => {
    switch (type) {
      case "crop":
        return Zap
      case "irrigation":
        return Droplets
      case "pest":
        return Bug
      case "temperature":
        return Thermometer
      default:
        return MapPin
    }
  }

  const getStatusColor = (status: FieldZone["status"]) => {
    switch (status) {
      case "healthy":
        return "text-primary border-primary bg-primary/10"
      case "warning":
        return "text-yellow-600 border-yellow-500 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20"
      case "critical":
        return "text-destructive border-destructive bg-destructive/10"
    }
  }

  const handleZoneClick = (zone: FieldZone) => {
    setSelectedZone(zone)
    onZoneClick?.(zone)
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{fieldName}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {zones.length} zones monitored
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Field background - simulated satellite view */}
          <div className="relative w-full h-64 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 rounded-lg overflow-hidden">
            {/* Field pattern overlay */}
            <div className="absolute inset-0 opacity-20">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(34, 197, 94, 0.1) 10px,
                  rgba(34, 197, 94, 0.1) 20px
                )`,
                }}
              />
            </div>

            {/* Zone markers */}
            {animatedZones.map((zone) => {
              const Icon = getZoneIcon(zone.type)
              return (
                <Button
                  key={zone.id}
                  variant="outline"
                  size="icon"
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 animate-in fade-in zoom-in",
                    getStatusColor(zone.status),
                    selectedZone?.id === zone.id && "ring-2 ring-ring scale-110",
                  )}
                  style={{
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                  }}
                  onClick={() => handleZoneClick(zone)}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              )
            })}
          </div>

          {/* Zone details panel */}
          {selectedZone && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border animate-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{selectedZone.name}</h4>
                <Badge variant="outline" className={cn("text-xs", getStatusColor(selectedZone.status))}>
                  {selectedZone.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                {selectedZone.type.charAt(0).toUpperCase() + selectedZone.type.slice(1)}: {selectedZone.value}
              </p>
              {selectedZone.details && <p className="text-xs text-muted-foreground">{selectedZone.details}</p>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
