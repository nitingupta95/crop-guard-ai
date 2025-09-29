import { Field, CropHealthData } from "@/lib/types/agriculture"

// Simulate database delay
// const DB_DELAY = 2000 // 2 seconds for normal operations
const LOCATION_DATA_DELAY = 10000 // 10 seconds for location-based data loading

// Mock user data structure
interface UserLocationData {
  latitude: number
  longitude: number
  fields: Field[]
  cropHealthData: CropHealthData[]
  lastUpdated: Date
}

// In-memory storage (simulates database)
let userLocationDatabase: Record<string, UserLocationData> = {}

// Generate unique key for location (rounded to avoid precision issues)
function getLocationKey(lat: number, lng: number): string {
  return `${lat.toFixed(4)}_${lng.toFixed(4)}`
}

// Empty/Zero state data
export const getEmptyData = () => ({
  fields: [] as Field[],
  cropHealthData: [] as CropHealthData[],
  totalFields: 0,
  totalArea: 0,
  averageHealthScore: 0,
  alertsCount: 0,
})

// Generate dummy data based on location
export const generateDummyDataForLocation = (latitude: number, longitude: number): UserLocationData => {
  const fields: Field[] = [
    {
      id: "field-1",
      name: "North Field",
      area: 12.5,
      crop: "Corn",
      plantingDate: "2024-04-15",
      expectedHarvest: "2024-09-15",
      status: "healthy" as const,
      location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      latitude: latitude + 0.001,
      longitude: longitude + 0.001,
      metrics: {
        soilMoisture: 68,
        cropHealth: 85,
        pestRisk: 15,
        yieldPrediction: 92,
      },
      zones: [
        {
          id: "zone-1",
          name: "Zone A",
          x: 100,
          y: 150,
          status: "healthy" as const,
          type: "crop" as const,
          value: "85%",
          details: "Excellent crop health",
          latitude: latitude + 0.001,
          longitude: longitude + 0.001,
        },
        {
          id: "zone-2", 
          name: "Zone B",
          x: 200,
          y: 180,
          status: "warning" as const,
          type: "irrigation" as const,
          value: "45%",
          details: "Low soil moisture",
          latitude: latitude + 0.002,
          longitude: longitude + 0.002,
        }
      ]
    },
    {
      id: "field-2",
      name: "South Field", 
      area: 8.7,
      crop: "Wheat",
      plantingDate: "2024-03-20",
      expectedHarvest: "2024-08-20",
      status: "healthy" as const,
      location: `${(latitude - 0.001).toFixed(4)}, ${(longitude - 0.001).toFixed(4)}`,
      latitude: latitude - 0.001,
      longitude: longitude - 0.001,
      metrics: {
        soilMoisture: 75,
        cropHealth: 91,
        pestRisk: 8,
        yieldPrediction: 88,
      },
      zones: [
        {
          id: "zone-3",
          name: "Zone C",
          x: 150,
          y: 120,
          status: "healthy" as const,
          type: "crop" as const,
          value: "91%",
          details: "Optimal conditions",
          latitude: latitude - 0.001,
          longitude: longitude - 0.001,
        }
      ]
    }
  ]

  const cropHealthData: CropHealthData[] = [
    {
      fieldId: "field-1",
      fieldName: "North Field",
      totalArea: 12.5,
      healthyArea: 10.6,
      warningArea: 1.9,
      criticalArea: 0,
      lastUpdated: new Date(),
      latitude: latitude + 0.001,
      longitude: longitude + 0.001,
      zones: [
        {
          id: "zone-1",
          name: "Zone A",
          x: 100,
          y: 150,
          status: "healthy" as const,
          type: "crop" as const,
          value: "85%",
          details: "Excellent crop health",
          latitude: latitude + 0.001,
          longitude: longitude + 0.001,
        }
      ]
    },
    {
      fieldId: "field-2",
      fieldName: "South Field",
      totalArea: 8.7,
      healthyArea: 8.7,
      warningArea: 0,
      criticalArea: 0,
      lastUpdated: new Date(),
      latitude: latitude - 0.001,
      longitude: longitude - 0.001,
      zones: [
        {
          id: "zone-3",
          name: "Zone C",
          x: 150,
          y: 120,
          status: "healthy" as const,
          type: "crop" as const,
          value: "91%",
          details: "Optimal conditions",
          latitude: latitude - 0.001,
          longitude: longitude - 0.001,
        }
      ]
    }
  ]

  return {
    latitude,
    longitude,
    fields,
    cropHealthData,
    lastUpdated: new Date()
  }
}

// Removed unused getAuthHeaders function

// Check if user has location data in database via API
// Check if user has location data in database
export async function checkUserLocationData() {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    console.log('checkUserLocationData - Token:', token ? 'Present' : 'Missing');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const response = await fetch('/api/location', { headers });
    console.log('checkUserLocationData - Response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 401) {
        console.log('checkUserLocationData - Authentication required');
        throw new Error('Authentication required');
      }
      console.log('checkUserLocationData - Response not ok:', response.status);
      return null;
    }
    
    const data = await response.json();
    console.log('checkUserLocationData - Data received:', data);
    return data.location;
  } catch (error) {
    console.error('Error checking user location data:', error);
    return null;
  }
}

// Save location to database via API
// Save user location to database
export async function saveUserLocation(latitude: number, longitude: number) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    console.log('saveUserLocation - Token:', token ? 'Present' : 'Missing');
    console.log('saveUserLocation - Coordinates:', { latitude, longitude });
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const response = await fetch('/api/location', {
      method: 'POST',
      headers,
      body: JSON.stringify({ latitude, longitude })
    });
    
    console.log('saveUserLocation - Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('saveUserLocation - Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('saveUserLocation - Success:', result);
    return result;
  } catch (error) {
    console.error('Error saving user location:', error);
    throw error;
  }
}

// Simulate loading location-specific data (with 10-second delay)
export const loadLocationData = async (latitude: number, longitude: number): Promise<UserLocationData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const locationKey = getLocationKey(latitude, longitude)
      let data = userLocationDatabase[locationKey]
      
      if (!data) {
        // Generate and save new data if it doesn't exist
        data = generateDummyDataForLocation(latitude, longitude)
        userLocationDatabase[locationKey] = data
      }
      
      console.log("Loaded location data from database:", locationKey)
      resolve(data)
    }, LOCATION_DATA_DELAY) // 10-second delay as requested
  })
}

// Get computed metrics from data
export const getMetricsFromData = (data: UserLocationData) => {
  const totalFields = data.fields.length
  const totalArea = data.fields.reduce((sum, field) => sum + field.area, 0)
  const averageHealthScore = data.fields.length > 0 
    ? data.fields.reduce((sum, field) => sum + field.metrics.cropHealth, 0) / data.fields.length 
    : 0
  const alertsCount = data.fields.filter(field => 
    field.status === "critical" || field.status === "warning" || field.metrics.cropHealth < 70
  ).length

  return {
    fields: data.fields,
    cropHealthData: data.cropHealthData,
    totalFields,
    totalArea,
    averageHealthScore,
    alertsCount,
  }
}

// Clear all location data (for testing)
export const clearAllLocationData = () => {
  userLocationDatabase = {}
  console.log("Cleared all location data")
}