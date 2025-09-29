"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { 
  loadLocationData, 
  getMetricsFromData, 
  getEmptyData,
  checkUserLocationData,
  saveUserLocation
} from "@/utils/location-data-service"

import { AuthWrapper } from "@/components/auth/AuthWrapper"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { FieldMap } from "@/components/agriculture/field-map"
import { CropHealthMap } from "@/components/dashboard/crop-health-map"
import { SoilConditionCard } from "@/components/dashboard/soil-condition-card"
import { TrendPlot } from "@/components/dashboard/trend-plot"
import { RiskZoneChart } from "@/components/dashboard/risk-zone-chart"
import { MetricCard } from "@/components/agriculture/metric-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Leaf, Droplets, AlertTriangle, MapPin, RefreshCw } from "lucide-react"

// Mock data for components
const mockSoilData = {
  fieldId: "field-1",
  fieldName: "North Field", 
  location: "Section A-1",
  lastUpdated: new Date(),
  metrics: {
    moisture: { name: "Soil Moisture", value: 42, unit: "%", optimal: { min: 40, max: 60 }, status: "good" as const, trend: { value: 5, isPositive: true }},
    ph: { name: "pH Level", value: 6.8, unit: "", optimal: { min: 6.0, max: 7.5 }, status: "good" as const, trend: { value: -2, isPositive: false }},
    nitrogen: { name: "Nitrogen", value: 85, unit: "ppm", optimal: { min: 80, max: 120 }, status: "good" as const },
    phosphorus: { name: "Phosphorus", value: 45, unit: "ppm", optimal: { min: 30, max: 50 }, status: "good" as const },
    potassium: { name: "Potassium", value: 180, unit: "ppm", optimal: { min: 150, max: 200 }, status: "good" as const },
    temperature: { name: "Temperature", value: 22, unit: "°C", optimal: { min: 18, max: 25 }, status: "good" as const },
    conductivity: { name: "Conductivity", value: 1.2, unit: "dS/m", optimal: { min: 0.8, max: 1.5 }, status: "good" as const },
  },
}

const mockRiskData = [
  {
    fieldId: "field-1",
    fieldName: "North Field",
    totalRiskScore: 35,
    riskFactors: [
      { 
        type: "pest" as const, 
        name: "Aphid Activity",
        severity: "low" as const, 
        probability: 15,
        impact: 20,
        affectedArea: 0.5,
        timeframe: "2-3 weeks",
        mitigation: ["Regular monitoring", "Beneficial insects"]
      }
    ],
    historicalData: [
      { date: "2024-01-01", riskScore: 30, pestRisk: 15, weatherRisk: 10, diseaseRisk: 5 }
    ],
    recommendations: [
      { priority: "medium" as const, action: "Monitor pest activity", timeframe: "Weekly" }
    ]
  }
]

const mockTrendData = [{
  metric: "Crop Health Index", unit: "NDVI", timeRange: "7d" as const,
  data: [
    { timestamp: "2024-01-01", actual: 0.75, predicted: 0.78 },
    { timestamp: "2024-01-07", actual: 0.89, predicted: 0.88 },
  ],
  prediction: { model: "LSTM" as const, accuracy: 94, nextValue: 0.91, trend: "increasing" as const, confidence: 87 },
  alerts: [],
}]

// Mock zones for dashboard map (same icons as fields page)
const mockDashboardZones = [
  {
    id: "zone-1",
    name: "Zone A",
    x: 25,
    y: 30,
    status: "healthy" as const,
    type: "crop" as const,
    value: "NDVI: 0.85",
    details: "Optimal vegetation health",
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
  },
  {
    id: "zone-3",
    name: "Zone C", 
    x: 40,
    y: 20,
    status: "healthy" as const,
    type: "pest" as const,
    value: "Risk: Low",
    details: "Minimal pest activity detected",
  },
  {
    id: "zone-4",
    name: "Zone D",
    x: 70,
    y: 25,
    status: "warning" as const,
    type: "temperature" as const,
    value: "Temp: 28°C",
    details: "Above optimal temperature range",
  },
]

function DashboardContent() {
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [isLocationSet, setIsLocationSet] = useState(false)
  const [dashboardData, setDashboardData] = useState(getEmptyData())
  const [isDataLoading, setIsDataLoading] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)
  const [showLocationSetup, setShowLocationSetup] = useState(true)

  // Load user location from database on mount
  useEffect(() => {
    const loadUserLocation = async () => {
      try {
        const dbLocation = await checkUserLocationData()
        if (dbLocation) {
          console.log('Loaded location from database:', dbLocation)
          setLatitude(dbLocation.latitude)
          setLongitude(dbLocation.longitude)
          setIsLocationSet(true)
          setShowLocationSetup(false)
        } else {
          console.log('No location found in database')
          setShowLocationSetup(true)
        }
      } catch (error) {
        console.error('Error loading location from database:', error)
        setShowLocationSetup(true)
      } finally {
        setIsLoadingLocation(false)
      }
    }

    loadUserLocation()
  }, [])

  const loadDashboardData = useCallback(async () => {
    if (!latitude || !longitude) {
      console.log('No coordinates available for data loading')
      return
    }
    
    console.log('Starting data load for coordinates:', latitude, longitude)
    setIsDataLoading(true)
    
    try {
      const data = await loadLocationData(latitude, longitude)
      console.log('Loaded location data:', data)
      const metrics = getMetricsFromData(data)
      console.log('Processed metrics:', metrics)
      setDashboardData(metrics)
    } catch (error) {
      console.error("Error loading location data:", error)
      setDashboardData(getEmptyData())
    } finally {
      setIsDataLoading(false)
    }
  }, [latitude, longitude])

  // Load dashboard data when location is available
  useEffect(() => {
    console.log('Dashboard useEffect:', { isLocationSet, latitude, longitude, isLoadingLocation })
    
    if (isLocationSet && latitude && longitude && !isLoadingLocation) {
      console.log('Loading dashboard data...')
      loadDashboardData()
    }
  }, [isLocationSet, latitude, longitude, isLoadingLocation, loadDashboardData])

  const handleLocationSet = async (lat: number, lng: number) => {
    setIsLoadingLocation(true)
    try {
      await saveUserLocation(lat, lng)
      setLatitude(lat)
      setLongitude(lng)
      setIsLocationSet(true)
      setShowLocationSetup(false)
      console.log('Location saved successfully:', { lat, lng })
    } catch (error) {
      console.error('Error saving location:', error)
      // Handle error - maybe show a toast
    } finally {
      setIsLoadingLocation(false)
    }
  }

  const handleRefresh = async () => {
    if (!isLocationSet || !latitude || !longitude) return
    await loadDashboardData()
  }

  if (isLoadingLocation) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (showLocationSetup || !isLocationSet) {
    return (
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 md:ml-64 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">Welcome to AgriMonitor</h1>
              <p className="text-muted-foreground">Set up your field location to get started</p>
            </div>
            <FieldMap
              fieldName="My Field"
              zones={[]}
              onZoneClick={() => {}}
              onLocationSet={handleLocationSet}
              allowLocationChange={true}
              className="w-full"
            />
          </div>
        </main>
      </div>
    )
  }

  const showDataLoading = isLoadingLocation || isDataLoading

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 md:ml-64 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Real-time agricultural monitoring and insights</p>
          </div>
          <Button onClick={handleRefresh} disabled={showDataLoading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", showDataLoading && "animate-spin")} />
            Refresh Data
          </Button>
        </div>

        {showDataLoading && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <LoadingSpinner size="lg" />
                <div>
                  <h3 className="text-lg font-medium">Loading Agricultural Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Fetching data for your location... This may take up to 10 seconds.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!showDataLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard title="Active Fields" value={dashboardData.totalFields} icon={MapPin} status={dashboardData.totalFields > 0 ? "good" : "warning"} />
              <MetricCard title="Crop Health" value={Math.round(dashboardData.averageHealthScore)} unit="%" icon={Leaf} status={dashboardData.averageHealthScore > 80 ? "good" : "warning"} progress={dashboardData.averageHealthScore} />
              <MetricCard title="Total Area" value={Math.round(dashboardData.totalArea * 10) / 10} unit="ha" icon={Droplets} status="good" />
              <MetricCard title="Risk Alerts" value={dashboardData.alertsCount} icon={AlertTriangle} status={dashboardData.alertsCount > 0 ? "warning" : "good"} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <CropHealthMap 
                  data={[{
                    fieldId: "field-1",
                    fieldName: "My Field", 
                    totalArea: 12.5,
                    healthyArea: 10.6,
                    warningArea: 1.9,
                    criticalArea: 0,
                    lastUpdated: new Date(),
                    zones: mockDashboardZones,
                    latitude: latitude ?? undefined,
                    longitude: longitude ?? undefined
                  }]} 
                  initialLatitude={latitude ?? undefined} 
                  initialLongitude={longitude ?? undefined} 
                />
              </div>
              <SoilConditionCard data={mockSoilData} />
              <RiskZoneChart data={mockRiskData} />
              <div className="lg:col-span-2"><TrendPlot data={mockTrendData} /></div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthWrapper>
      <DashboardContent />
    </AuthWrapper>
  )
}