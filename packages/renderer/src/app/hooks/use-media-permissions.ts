import { useState, useEffect } from 'react'
import {
  type MediaAccessStatus,
  checkMediaPermissions,
  requestMediaPermissions,
} from '@vite-electron-builder/preload'

type MediaPermissionStatus = {
  camera: MediaAccessStatus
  microphone: MediaAccessStatus
  error?: string
}

export function useMediaPermissions() {
  const [permissions, setPermissions] = useState<MediaPermissionStatus>({
    camera: 'not-determined',
    microphone: 'not-determined',
  })

  const [isLoading, setIsLoading] = useState(false)

  const checkInitialPermissions = async () => {
    setIsLoading(true)

    try {
      const status = await checkMediaPermissions()

      setPermissions(status)

      if (
        status.camera === 'not-determined' ||
        status.microphone === 'not-determined'
      ) {
        await handleRequestPermissions()
      }
    } catch (error) {
      console.error(error)

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestPermissions = async () => {
    setIsLoading(true)

    try {
      const result = await requestMediaPermissions()

      if (result.error) {
        throw new Error(result.error)
      }

      const status = await checkMediaPermissions()

      setPermissions(status)
    } catch (error) {
      console.error(error)

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkInitialPermissions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    permissions,
    isLoading,
    checkPermissions: checkInitialPermissions,
    requestPermissions: handleRequestPermissions,
  }
}
