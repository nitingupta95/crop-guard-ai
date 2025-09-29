"use client"

import { useState, useEffect } from 'react'
import { checkUserLocationData } from '@/utils/location-data-service'

interface UserLocation {
  latitude: number
  longitude: number
}

interface UseUserLocationReturn {
  userLocation: UserLocation | null
  isLoading: boolean
  hasLocation: boolean
  refetch: () => Promise<void>
}

export function useUserLocation(): UseUserLocationReturn {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchLocation = async () => {
    try {
      setIsLoading(true)
      const dbLocation = await checkUserLocationData()
      if (dbLocation) {
        setUserLocation({
          latitude: dbLocation.latitude,
          longitude: dbLocation.longitude
        })
      } else {
        setUserLocation(null)
      }
    } catch (error) {
      console.error('Error loading user location:', error)
      setUserLocation(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLocation()
  }, [])

  return {
    userLocation,
    isLoading,
    hasLocation: userLocation !== null,
    refetch: fetchLocation
  }
}