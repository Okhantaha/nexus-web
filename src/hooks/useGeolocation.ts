import { useState, useEffect } from 'react'

interface GeoState {
  lat: number | null
  lon: number | null
  error: string | null
  loading: boolean
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    lat: null,
    lon: null,
    error: null,
    loading: true,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ lat: 39.9564, lon: 32.8527, error: null, loading: false })
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setState({ lat: pos.coords.latitude, lon: pos.coords.longitude, error: null, loading: false }),
      () => setState({ lat: 39.9564, lon: 32.8527, error: null, loading: false }),
      { timeout: 5000 }
    )
  }, [])

  return state
}
