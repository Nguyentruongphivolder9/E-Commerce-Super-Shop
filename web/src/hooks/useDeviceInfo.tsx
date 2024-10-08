import { useState, useEffect } from 'react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import Bowser from 'bowser'

export type DeviceInfo = {
  ipAddress: string
  country: string
  city: string
  latitude: string
  longitude: string
  region: string
  regionName: string
  deviceFingerPrint: string
  browserName: string
  deviceType?: string 
  isPrimary?: boolean
  assignedTime?: string
}

const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    ipAddress: '',
    country: '',
    city: '',
    latitude: '',
    longitude: '',
    region: '',
    regionName: '',
    deviceFingerPrint: '',
    browserName: '',
    deviceType: ''
  })

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json')
        const ipData = await ipResponse.json()
        const ipAddress = ipData.ip

        const locationResponse = await fetch(`http://ip-api.com/json/${ipAddress}`)
        const locationData = await locationResponse.json()

        let deviceId = localStorage.getItem('deviceFingerPrintId')
        if (!deviceId) {
          const fp = await FingerprintJS.load()
          const result = await fp.get()
          deviceId = result.visitorId
          localStorage.setItem('deviceFingerPrintId', deviceId)
        }

        const browser = Bowser.getParser(window.navigator.userAgent)
        const name = browser.getBrowserName()
        const type = browser.getPlatformType()

        const updatedDeviceInfo = {
          ipAddress: locationData.query,
          country: locationData.country,
          city: locationData.city,
          latitude: locationData.lat.toString(),
          longitude: locationData.lon.toString(),
          region: locationData.region,
          regionName: locationData.regionName,
          deviceFingerPrint: deviceId!,
          browserName: name,
          deviceType: type
        }

        setDeviceInfo(updatedDeviceInfo)
      } catch (error) {
        console.error('Failed to fetch device info:', error)
      }
    }

    fetchDeviceInfo()
  }, [])

  useEffect(() => {
      localStorage.setItem('deviceInfo', JSON.stringify(deviceInfo))
      localStorage.setItem('deviceFingerPrintId', deviceInfo.deviceFingerPrint)
  }, [deviceInfo])

  return {
    deviceInfo,
    setDeviceInfo
  }
}

export default useDeviceInfo
