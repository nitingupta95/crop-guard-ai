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
  metrics: {
    soilMoisture: number
    cropHealth: number
    pestRisk: number
    yieldPrediction: number
  }
}
