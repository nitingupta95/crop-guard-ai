"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Zap, Droplets, Bug, Thermometer, Navigation, Loader2, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import "leaflet/dist/leaflet.css"
import type * as L from "leaflet"

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false })

// Draggable Center Marker Component
interface DraggableMarkerProps {
  position: [number, number]
  onPositionChange: (lat: number, lng: number) => void
  fieldName: string
  isPendingConfirmation?: boolean
  isLocationConfirmed?: boolean
}

const DraggableMarker = ({ position, onPositionChange, fieldName, isPendingConfirmation, isLocationConfirmed }: DraggableMarkerProps) => {
  const [customIcon, setCustomIcon] = useState<L.DivIcon | null>(null)

  useEffect(() => {
    const createIcon = async () => {
      if (typeof window !== "undefined") {
        try {
          const leaflet = await import("leaflet")
          
          // Simple draggable location pin with state-based colors
          const pinColor = isLocationConfirmed ? '#22c55e' : '#3b82f6' // Blue for draggable, green for confirmed
          
          const icon = leaflet.divIcon({
            html: `<div style="
              background: ${pinColor};
              width: 24px;
              height: 24px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              cursor: move;
            "></div>`,
            className: 'draggable-marker',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })
          
          setCustomIcon(icon)
        } catch (error) {
          console.error('Error creating marker icon:', error)
        }
      }
    }
    
    createIcon()
  }, [isPendingConfirmation, isLocationConfirmed])

  const handleDragEnd = (event: L.LeafletEvent) => {
    const marker = event.target as L.Marker
    const newPosition = marker.getLatLng()
    const newLat = newPosition.lat
    const newLng = newPosition.lng
    
    console.log('Marker drag ended at:', newLat, newLng)
    onPositionChange(newLat, newLng)
  }

  const handleDrag = (event: L.LeafletEvent) => {
    const marker = event.target as L.Marker
    const newPosition = marker.getLatLng()
    const newLat = newPosition.lat
    const newLng = newPosition.lng
    
    console.log('Marker being dragged to:', newLat, newLng)
    // Update coordinates in real-time during drag
    onPositionChange(newLat, newLng)
  }

  if (!customIcon) {
    return null // Don't render until icon is ready
  }

  return (
    <Marker
      position={position}
      icon={customIcon}
      draggable={true}
      interactive={true}
      eventHandlers={{
        drag: handleDrag,
        dragend: handleDragEnd,
      }}
    >
      <Popup>
        <div className="p-2">
          <h4 className="font-semibold text-sm">{fieldName} Center</h4>
          <p className="text-xs text-muted-foreground mb-1">
            📍 Drag this marker to set exact location
          </p>
          <p className="text-xs text-muted-foreground">
            Lat: {position[0].toFixed(6)}<br/>
            Lng: {position[1].toFixed(6)}
          </p>
        </div>
      </Popup>
    </Marker>
  )
}

// Custom Zone Marker Component
interface ZoneMarkerProps {
  position: [number, number]
  zone: FieldZone
  onZoneClick: (zone: FieldZone) => void
  selectedZone: FieldZone | null
}

const ZoneMarker = ({ position, zone, onZoneClick, selectedZone }: ZoneMarkerProps) => {
  const getZoneIcon = (type: FieldZone["type"]) => {
    switch (type) {
      case "crop": return "🌱"
      case "irrigation": return "💧"
      case "pest": return "🐛"
      case "temperature": return "🌡️"
      case "disease": return "🦠"
      default: return "📍"
    }
  }

  const getStatusColor = (status: FieldZone["status"]) => {
    switch (status) {
      case "healthy": return "#22c55e"
      case "warning": return "#eab308"
      case "critical": return "#ef4444"
      default: return "#6b7280"
    }
  }

  const [customIcon, setCustomIcon] = useState<L.DivIcon | null>(null)
  
  useEffect(() => {
    const createIcon = async () => {
      if (typeof window !== "undefined") {
        const leaflet = await import("leaflet")
        const iconHtml = `
          <div style="
            background-color: ${getStatusColor(zone.status)}; 
            width: 32px; 
            height: 32px; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 16px;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            ${selectedZone?.id === zone.id ? 'border: 3px solid #000; transform: scale(1.2);' : ''}
          ">
            ${getZoneIcon(zone.type)}
          </div>
        `
        
        const icon = leaflet.divIcon({
          html: iconHtml,
          className: 'custom-zone-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16]
        })
        
        setCustomIcon(icon)
      }
    }
    
    createIcon()
  }, [zone.status, selectedZone?.id, zone.type, zone.id])

  if (!customIcon) {
    return null // Don't render until icon is ready
  }

  return (
    <Marker 
      position={position} 
      icon={customIcon}
      eventHandlers={{
        click: () => onZoneClick(zone),
      }}
    >
      <Popup>
        <div className="p-2">
          <h4 className="font-semibold text-sm">{zone.name}</h4>
          <p className="text-xs text-muted-foreground mb-1">
            Status: <span className={`font-medium ${
              zone.status === 'healthy' ? 'text-green-600' : 
              zone.status === 'warning' ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {zone.status.toUpperCase()}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            {zone.type.charAt(0).toUpperCase() + zone.type.slice(1)}: {zone.value}
          </p>
          {zone.details && (
            <p className="text-xs text-muted-foreground mt-1">
              {zone.details}
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  )
}

type FieldZone = {
  id: string
  name: string
  x: number
  y: number
  status: "healthy" | "warning" | "critical"
  type: "crop" | "irrigation" | "pest" | "temperature" | "disease"  
  value: string
  details?: string
  latitude?: number
  longitude?: number
}

interface FieldMapProps {
  fieldName: string
  zones: FieldZone[]
  onZoneClick?: (zone: FieldZone) => void
  className?: string
  initialLatitude?: number
  initialLongitude?: number
}

export function FieldMap({ fieldName, zones, onZoneClick, className, initialLatitude = 40.7128, initialLongitude = -74.0060 }: FieldMapProps) {
  const [selectedZone, setSelectedZone] = useState<FieldZone | null>(null)
  const [animatedZones, setAnimatedZones] = useState<FieldZone[]>([])
  const [latitude, setLatitude] = useState<number>(initialLatitude)
  const [longitude, setLongitude] = useState<number>(initialLongitude)
  const [isMapMode, setIsMapMode] = useState<boolean>(false)
  const [isClient, setIsClient] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isPendingConfirmation, setIsPendingConfirmation] = useState(false)
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false)
  const [isSettingLocation, setIsSettingLocation] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

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

  const handleLocationUpdate = () => {
    setIsGettingLocation(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.")
      setIsGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLat = position.coords.latitude
        const newLng = position.coords.longitude
        setLatitude(newLat)
        setLongitude(newLng)
        setIsMapMode(true) // Show map immediately
        setIsSettingLocation(true) // Enable draggable pin mode
        setIsGettingLocation(false)
        setLocationError(null)
        setIsPendingConfirmation(true) // Show confirm button immediately
        setIsLocationConfirmed(false) // Not confirmed yet
        console.log('GPS Success: Map should show with draggable pin at', newLat, newLng)
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location."
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out."
            break
        }
        setLocationError(errorMessage)
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    )
  }

  const handleMarkerPositionChange = (lat: number, lng: number) => {
    setLatitude(lat)
    setLongitude(lng)
    setIsPendingConfirmation(true)
    setIsLocationConfirmed(false)
  }

  const handleConfirmLocation = () => {
    setIsPendingConfirmation(false)
    setIsLocationConfirmed(true)
    setIsSettingLocation(false) // Exit location setting mode, show zones
  }

  const handleCancelLocation = () => {
    setIsPendingConfirmation(false)
    // Stay in location setting mode for further adjustments
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
        <div className="space-y-4">
          {/* Coordinate Input Section */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="latitude" className="text-sm font-medium">
                📍 Latitude
                {isGettingLocation && <span className="text-xs text-primary ml-1">(Getting GPS...)</span>}
              </Label>
              <Input
                id="latitude"
                type="number"
                step="0.000001"
                value={latitude.toFixed(6)}
                onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                placeholder="Enter latitude or use GPS"
                className="text-sm"
                disabled={isGettingLocation}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude" className="text-sm font-medium">
                🌐 Longitude
                {isGettingLocation && <span className="text-xs text-primary ml-1">(Getting GPS...)</span>}
              </Label>
              <Input
                id="longitude"
                type="number"
                step="0.000001"
                value={longitude.toFixed(6)}
                onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                placeholder="Enter longitude or use GPS"
                className="text-sm"
                disabled={isGettingLocation}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Button 
                onClick={handleLocationUpdate} 
                className="w-full" 
                size="sm"
                disabled={isGettingLocation}
              >
                {isGettingLocation ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Navigation className="h-4 w-4 mr-2" />
                )}
                {isGettingLocation ? "Getting GPS Location..." : "Use My GPS Location"}
              </Button>
              {!isGettingLocation && !locationError && !isPendingConfirmation && !isSettingLocation && (
                <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-200 dark:border-blue-800">
                  � Click "Use My GPS Location" to start field mapping
                </div>
              )}
              {isSettingLocation && isPendingConfirmation && (
                <div className="space-y-2">
                  <div className="text-xs text-primary bg-primary/10 p-2 rounded border border-primary/20">
                    📍 GPS location found! Drag the blue pin to adjust, then confirm your exact field location
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleConfirmLocation}
                      size="sm"
                      className="flex-1"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Confirm Location
                    </Button>
                    <Button 
                      onClick={handleCancelLocation}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              {isLocationConfirmed && (
                <div className="text-xs text-primary bg-primary/10 p-2 rounded border border-primary/20">
                  ✅ Location confirmed at {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </div>
              )}
              {locationError && (
                <div className="text-xs text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">
                  {locationError}
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            {/* Toggle between map view and satellite simulation */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={isMapMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsMapMode(true)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Map View
              </Button>
              <Button
                variant={!isMapMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsMapMode(false)}
              >
                Satellite View
              </Button>
            </div>

            {/* Map or Satellite View */}
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              {isMapMode && isClient ? (
                <MapContainer
                  center={[latitude, longitude]}
                  zoom={16}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                  
                  {/* Draggable center marker for precise location selection */}
                  <DraggableMarker
                    position={[latitude, longitude]}
                    onPositionChange={handleMarkerPositionChange}
                    fieldName={fieldName}
                    isPendingConfirmation={isPendingConfirmation}
                    isLocationConfirmed={isLocationConfirmed}
                  />
                  
                  {/* Zone markers with custom icons - only show after location is confirmed */}
                  {isLocationConfirmed && animatedZones.map((zone) => {
                    // Calculate position: if zone has GPS coordinates use them, otherwise offset from center
                    const zonePosition: [number, number] = zone.latitude && zone.longitude 
                      ? [zone.latitude, zone.longitude]
                      : [
                          latitude + (zone.y - 50) * 0.0001, // Convert percentage to lat offset
                          longitude + (zone.x - 50) * 0.0001 // Convert percentage to lng offset
                        ];

                    return (
                      <ZoneMarker
                        key={zone.id}
                        position={zonePosition}
                        zone={zone}
                        onZoneClick={handleZoneClick}
                        selectedZone={selectedZone}
                      />
                    );
                  })}
                </MapContainer>
              ) : (
                <div className="relative w-full h-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20">
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
              )}
            </div>
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
