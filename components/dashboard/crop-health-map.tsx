"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FieldMap } from "@/components/agriculture/field-map"
import { StatusBadge } from "@/components/agriculture/status-badge"
import { Maximize2, RefreshCw, Satellite, Map } from "lucide-react"
import { cn } from "@/lib/utils"

interface CropHealthData {
  fieldId: string
  fieldName: string
  totalArea: number
  healthyArea: number
  warningArea: number
  criticalArea: number
  lastUpdated: Date
  zones: Array<{
    id: string
    name: string
    x: number
    y: number
    status: "healthy" | "warning" | "critical"
    type: "crop" | "irrigation" | "pest" | "temperature"|"disease" 
    value: string
    details?: string
    ndvi?: number
    moisture?: number
    temperature?: number
  }>
}

interface CropHealthMapProps {
  data: CropHealthData[]
  selectedFieldId?: string
  onFieldSelect?: (fieldId: string) => void
  className?: string
}

export function CropHealthMap({ data, selectedFieldId, onFieldSelect, className }: CropHealthMapProps) {
  const [activeField, setActiveField] = useState(selectedFieldId || data[0]?.fieldId)
  const [viewMode, setViewMode] = useState<"satellite" | "health">("health")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const currentField = data.find((field) => field.fieldId === activeField)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  const getHealthPercentage = (field: CropHealthData) => {
    return Math.round((field.healthyArea / field.totalArea) * 100)
  }

  const getOverallStatus = (field: CropHealthData): "healthy" | "warning" | "critical" => {
    const healthPercentage = getHealthPercentage(field)
    if (healthPercentage >= 80) return "healthy"
    if (healthPercentage >= 60) return "warning"
    return "critical"
  }

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Crop Health Monitoring</CardTitle>
          <CardAction>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              </Button>
              <Button variant="outline" size="sm">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Field Selection */}
        <div className="flex flex-wrap gap-2">
          {data.map((field) => (
            <Button
              key={field.fieldId}
              variant={activeField === field.fieldId ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setActiveField(field.fieldId)
                onFieldSelect?.(field.fieldId)
              }}
              className="flex items-center gap-2"
            >
              {field.fieldName}
              <StatusBadge status={getOverallStatus(field)} size="sm" />
            </Button>
          ))}
        </div>

        {currentField && (
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "satellite" | "health")}>
            <div className="flex items-center justify-between">
              <TabsList className="grid w-fit grid-cols-2">
                <TabsTrigger value="health" className="flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  Health View
                </TabsTrigger>
                <TabsTrigger value="satellite" className="flex items-center gap-2">
                  <Satellite className="h-4 w-4" />
                  Satellite View
                </TabsTrigger>
              </TabsList>

              <div className="text-sm text-muted-foreground">
                Last updated: {currentField.lastUpdated.toLocaleTimeString()}
              </div>
            </div>

            <TabsContent value="health" className="space-y-4">
              <FieldMap
                fieldName={currentField.fieldName}
                zones={currentField.zones}
                onZoneClick={(zone) => console.log("Zone clicked:", zone)}
              />

              {/* Health Statistics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="text-2xl font-bold text-primary">{Math.round(currentField.healthyArea)}</div>
                  <div className="text-sm text-muted-foreground">Healthy Acres</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {Math.round(currentField.warningArea)}
                  </div>
                  <div className="text-sm text-muted-foreground">Warning Acres</div>
                </div>
                <div className="text-center p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                  <div className="text-2xl font-bold text-destructive">{Math.round(currentField.criticalArea)}</div>
                  <div className="text-sm text-muted-foreground">Critical Acres</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="satellite" className="space-y-4">
              <div className="relative w-full h-64 bg-gradient-to-br from-green-200 via-green-300 to-green-400 dark:from-green-900/40 dark:via-green-800/40 dark:to-green-700/40 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-[url('/placeholder-nirmx.png')] bg-cover bg-center opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                    Satellite imagery integration coming soon
                  </Badge>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
