"use client"

interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

interface FieldData {
  id: string
  name: string
  location: { lat: number; lng: number }
  area: number
  cropType: string
  healthScore: number
  soilMoisture: number
  pestRisk: "low" | "medium" | "high"
  lastUpdated: string
}

interface CropHealthMetrics {
  fieldId: string
  ndvi: number
  temperature: number
  humidity: number
  predictions: {
    date: string
    healthScore: number
    confidence: number
  }[]
}

interface SoilCondition {
  fieldId: string
  moisture: number
  ph: number
  nitrogen: number
  phosphorus: number
  potassium: number
  temperature: number
  conductivity: number
}

interface PestAlert {
  id: string
  fieldId: string
  type: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
  recommendations: string[]
  timestamp: string
  resolved: boolean
}

// Mock API base URL - replace with actual API endpoint
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Generic API call function with error handling
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { data, success: true }
  } catch (error) {
    console.error("API call failed:", error)
    return {
      data: {} as T,
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Field data API calls
export const fieldApi = {
  getAll: () => apiCall<FieldData[]>("/fields"),
  getById: (id: string) => apiCall<FieldData>(`/fields/${id}`),
  update: (id: string, data: Partial<FieldData>) =>
    apiCall<FieldData>(`/fields/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
}

// Crop health API calls
export const cropHealthApi = {
  getMetrics: (fieldId: string) => apiCall<CropHealthMetrics>(`/crop-health/${fieldId}`),
  getPredictions: (fieldId: string, days = 7) =>
    apiCall<CropHealthMetrics["predictions"]>(`/crop-health/${fieldId}/predictions?days=${days}`),
}

// Soil condition API calls
export const soilApi = {
  getConditions: (fieldId: string) => apiCall<SoilCondition>(`/soil/${fieldId}`),
  getHistory: (fieldId: string, days = 30) => apiCall<SoilCondition[]>(`/soil/${fieldId}/history?days=${days}`),
}

// Pest alert API calls
export const pestApi = {
  getAlerts: (fieldId?: string) => {
    const endpoint = fieldId ? `/pests/alerts?fieldId=${fieldId}` : "/pests/alerts"
    return apiCall<PestAlert[]>(endpoint)
  },
  markResolved: (alertId: string) =>
    apiCall<PestAlert>(`/pests/alerts/${alertId}/resolve`, {
      method: "POST",
    }),
  createAlert: (alert: Omit<PestAlert, "id" | "timestamp">) =>
    apiCall<PestAlert>("/pests/alerts", {
      method: "POST",
      body: JSON.stringify(alert),
    }),
}

// Mock data generators for development
export const mockData = {
  generateFieldData: (): FieldData[] => [
    {
      id: "1",
      name: "North Field",
      location: { lat: 40.7128, lng: -74.006 },
      area: 25.5,
      cropType: "Corn",
      healthScore: 85,
      soilMoisture: 65,
      pestRisk: "low",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "2",
      name: "South Field",
      location: { lat: 40.7589, lng: -73.9851 },
      area: 18.2,
      cropType: "Wheat",
      healthScore: 72,
      soilMoisture: 58,
      pestRisk: "medium",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "3",
      name: "East Field",
      location: { lat: 40.7505, lng: -73.9934 },
      area: 32.1,
      cropType: "Soybeans",
      healthScore: 91,
      soilMoisture: 72,
      pestRisk: "low",
      lastUpdated: new Date().toISOString(),
    },
  ],

  generateCropHealthMetrics: (fieldId: string): CropHealthMetrics => ({
    fieldId,
    ndvi: 0.7 + Math.random() * 0.2,
    temperature: 22 + Math.random() * 8,
    humidity: 60 + Math.random() * 20,
    predictions: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
      healthScore: 70 + Math.random() * 25,
      confidence: 0.8 + Math.random() * 0.15,
    })),
  }),

  generateSoilCondition: (fieldId: string): SoilCondition => ({
    fieldId,
    moisture: 50 + Math.random() * 30,
    ph: 6.0 + Math.random() * 2,
    nitrogen: 20 + Math.random() * 40,
    phosphorus: 15 + Math.random() * 25,
    potassium: 100 + Math.random() * 100,
    temperature: 18 + Math.random() * 10,
    conductivity: 0.5 + Math.random() * 1.5,
  }),

  generatePestAlerts: (): PestAlert[] => [
    {
      id: "1",
      fieldId: "1",
      type: "Aphids",
      severity: "medium",
      description: "Aphid population detected in corn field sections 3-5",
      recommendations: ["Apply targeted insecticide", "Monitor population levels", "Check for natural predators"],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      resolved: false,
    },
    {
      id: "2",
      fieldId: "2",
      type: "Fungal Disease",
      severity: "high",
      description: "Early signs of rust disease detected in wheat crop",
      recommendations: ["Apply fungicide treatment", "Improve air circulation", "Monitor weather conditions"],
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      resolved: false,
    },
  ],
}

// Data fetching hooks for React components
import { useState } from "react"

export const useApiData = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async (apiCall: () => Promise<ApiResponse<any>>): Promise<any | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiCall()
      if (response.success) {
        return response.data
      } else {
        setError(response.message || "Failed to fetch data")
        return null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      return null
    } finally {
      setLoading(false)
    }
  }

  return { fetchData, loading, error }
}
