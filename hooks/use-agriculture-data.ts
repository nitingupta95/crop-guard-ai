"use client"

import { useState, useEffect, useCallback } from "react"
import { mockData } from "@/utils/api"

// Custom hook for field data
export function useFieldData() {
  const [fields, setFields] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFields = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Use mock data for development
      const mockFields = mockData.generateFieldData()
      setFields(mockFields)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch fields")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFields()
  }, [fetchFields])

  return { fields, loading, error, refetch: fetchFields }
}

// Custom hook for crop health data
export function useCropHealth(fieldId: string) {
  const [cropHealth, setCropHealth] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCropHealth = useCallback(async () => {
    if (!fieldId) return

    setLoading(true)
    setError(null)

    try {
      // Use mock data for development
      const mockHealth = mockData.generateCropHealthMetrics(fieldId)
      setCropHealth(mockHealth)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch crop health")
    } finally {
      setLoading(false)
    }
  }, [fieldId])

  useEffect(() => {
    fetchCropHealth()
  }, [fetchCropHealth])

  return { cropHealth, loading, error, refetch: fetchCropHealth }
}

// Custom hook for soil conditions
export function useSoilConditions(fieldId: string) {
  const [soilConditions, setSoilConditions] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSoilConditions = useCallback(async () => {
    if (!fieldId) return

    setLoading(true)
    setError(null)

    try {
      // Use mock data for development
      const mockSoil = mockData.generateSoilCondition(fieldId)
      setSoilConditions(mockSoil)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch soil conditions")
    } finally {
      setLoading(false)
    }
  }, [fieldId])

  useEffect(() => {
    fetchSoilConditions()
  }, [fetchSoilConditions])

  return { soilConditions, loading, error, refetch: fetchSoilConditions }
}

// Custom hook for pest alerts
export function usePestAlerts(fieldId?: string) {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAlerts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Use mock data for development
      const mockAlerts = mockData.generatePestAlerts()
      const filteredAlerts = fieldId ? mockAlerts.filter((alert) => alert.fieldId === fieldId) : mockAlerts
      setAlerts(filteredAlerts)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch alerts")
    } finally {
      setLoading(false)
    }
  }, [fieldId])

  const markResolved = useCallback(async (alertId: string) => {
    try {
      setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, resolved: true } : alert)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resolve alert")
    }
  }, [])

  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  return { alerts, loading, error, refetch: fetchAlerts, markResolved }
}

// Custom hook for real-time updates
export function useRealTimeUpdates() {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return { lastUpdate }
}
