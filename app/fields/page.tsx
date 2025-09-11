"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { FieldMap } from "@/components/agriculture/field-map"
import { StatusBadge } from "@/components/agriculture/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Search, Filter, Plus, Grid, List, Maximize2 } from "lucide-react"
import type { Field } from "@/lib/types/agriculture"

const mockFields: Field[] = [
  {
    id: "field-1",
    name: "North Field",
    area: 120,
    crop: "Corn",
    plantingDate: "2024-03-15",
    expectedHarvest: "2024-09-15",
    status: "healthy",
    location: "40.7128° N, 74.0060° W",
    zones: [
      {
        id: "zone-1",
        name: "Zone A",
        x: 25,
        y: 30,
        status: "healthy",
        type: "crop",
        value: "NDVI: 0.85",
        details: "Optimal vegetation health",
      },
      {
        id: "zone-2",
        name: "Zone B",
        x: 60,
        y: 45,
        status: "warning",
        type: "irrigation",
        value: "Moisture: 35%",
        details: "Below optimal moisture levels",
      },
    ],
    metrics: {
      soilMoisture: 42,
      cropHealth: 87,
      pestRisk: 15,
      yieldPrediction: 185,
    },
  },
  {
    id: "field-2",
    name: "South Field",
    area: 85,
    crop: "Soybeans",
    plantingDate: "2024-04-01",
    expectedHarvest: "2024-10-01",
    status: "warning",
    location: "40.7100° N, 74.0050° W",
    zones: [
      {
        id: "zone-3",
        name: "Zone A",
        x: 40,
        y: 25,
        status: "warning",
        type: "pest",
        value: "Pest Risk: Medium",
        details: "Increased aphid activity",
      },
    ],
    metrics: {
      soilMoisture: 35,
      cropHealth: 72,
      pestRisk: 45,
      yieldPrediction: 52,
    },
  },
  {
    id: "field-3",
    name: "East Field",
    area: 95,
    crop: "Wheat",
    plantingDate: "2024-02-20",
    expectedHarvest: "2024-08-20",
    status: "critical",
    location: "40.7150° N, 74.0040° W",
    zones: [
      {
        id: "zone-4",
        name: "Zone A",
        x: 50,
        y: 60,
        status: "critical",
        type: "disease", // ✅ now valid
        value: "Disease Risk: High",
        details: "Fungal infection spreading",
      },
    ],
    metrics: {
      soilMoisture: 28,
      cropHealth: 45,
      pestRisk: 75,
      yieldPrediction: 38,
    },
  },
]

export default function FieldsPage() {
  const [selectedField, setSelectedField] = useState<Field>(mockFields[0])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFields = mockFields.filter(
    (field) =>
      field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.crop.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 md:ml-64 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Field Overview</h1>
            <p className="text-muted-foreground">Monitor and manage all your agricultural fields</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        </div>

        {/* Search + Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search fields..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <div className="flex border rounded-lg">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fields List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold">Fields ({filteredFields.length})</h2>
            {viewMode === "grid" ? (
              <div className="grid gap-4">
                {filteredFields.map((field) => (
                  <Card
                    key={field.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedField.id === field.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedField(field)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{field.name}</CardTitle>
                        <StatusBadge status={field.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {field.crop} • {field.area} acres
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Soil Moisture</p>
                          <p className="font-medium">{field.metrics.soilMoisture}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Crop Health</p>
                          <p className="font-medium">{field.metrics.cropHealth}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Pest Risk</p>
                          <p className="font-medium">{field.metrics.pestRisk}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Yield Est.</p>
                          <p className="font-medium">{field.metrics.yieldPrediction} bu/ac</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFields.map((field) => (
                  <div
                    key={field.id}
                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all hover:bg-muted/20 ${
                      selectedField.id === field.id ? "bg-muted/30 border-primary" : ""
                    }`}
                    onClick={() => setSelectedField(field)}
                  >
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{field.name}</h3>
                        <StatusBadge status={field.status} size="sm" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {field.crop} • {field.area} acres
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{field.metrics.cropHealth}%</p>
                      <p className="text-xs text-muted-foreground">Health</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Field Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{selectedField.name}</CardTitle>
                    <p className="text-muted-foreground mt-1">
                      {selectedField.crop} • {selectedField.area} acres • {selectedField.location}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="map" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="map">Field Map</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="map">
<FieldMap
  fieldName={selectedField.name}
  zones={selectedField.zones}
  onZoneClick={(zone) => console.log("Zone clicked:", zone)}
/>

                  </TabsContent>

                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Planting Date</p>
                        <p className="font-medium">{new Date(selectedField.plantingDate).toLocaleDateString()}</p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Expected Harvest</p>
                        <p className="font-medium">{new Date(selectedField.expectedHarvest).toLocaleDateString()}</p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Crop Type</p>
                        <p className="font-medium">{selectedField.crop}</p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Area</p>
                        <p className="font-medium">{selectedField.area} acres</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-sm text-muted-foreground">Soil Moisture</p>
                        <p className="text-2xl font-bold text-primary">{selectedField.metrics.soilMoisture}%</p>
                      </div>
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-sm text-muted-foreground">Crop Health</p>
                        <p className="text-2xl font-bold text-primary">{selectedField.metrics.cropHealth}%</p>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
                        <p className="text-sm text-muted-foreground">Pest Risk</p>
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                          {selectedField.metrics.pestRisk}%
                        </p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Yield Prediction</p>
                        <p className="text-2xl font-bold text-foreground">{selectedField.metrics.yieldPrediction}</p>
                        <p className="text-xs text-muted-foreground">bu/acre</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="history">
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Historical data visualization coming soon</p>
                    </div>
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
