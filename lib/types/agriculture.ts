// lib/types/agriculture.ts
export type FieldZone = {
  id: string
  name: string
  x: number
  y: number
  status: "healthy" | "warning" | "critical"
  type: "crop" | "irrigation" | "pest" | "temperature" | "disease"  // <-- added "disease"
  value: string
  details?: string
  latitude?: number
  longitude?: number
}


export type Field = {
  id: string
  name: string
  area: number
  crop: string
  plantingDate: string
  expectedHarvest: string
  status: "healthy" | "warning" | "critical"
  location: string
  zones: FieldZone[]
  latitude?: number
  longitude?: number
  metrics: {
    soilMoisture: number
    cropHealth: number
    pestRisk: number
    yieldPrediction: number
  }
}


export type CropHealthData = {
  fieldId: string
  fieldName: string
  totalArea: number
  healthyArea: number
  warningArea: number
  criticalArea: number
  lastUpdated: Date
  zones: FieldZone[]
  latitude?: number
  longitude?: number
}