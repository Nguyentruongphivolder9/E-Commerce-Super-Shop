import { useState, useEffect } from 'react'

export const useLocation = () => {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState<string | null>('')

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json')
        const ipData = await ipResponse.json()
        const ipAddress = ipData.ip
        const locationResponse = await fetch(`http://ip-api.com/json/${ipAddress}`)
        const locationData = await locationResponse.json()
        setLocation(locationData)
      } catch (error) {
        console.error('Failed to fetch location data:', error)
        setError('Failed to fetch location data')
      }
    }

    fetchLocation()
  }, [])

  return { location }
}
