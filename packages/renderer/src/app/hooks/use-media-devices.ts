import { useState, useEffect } from 'react'

type MediaDevice = {
  deviceId: string
  label: string
}

export const useMediaDevices = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [videoDevices, setVideoDevices] = useState<MediaDevice[]>([])
  const [audioDevices, setAudioDevices] = useState<MediaDevice[]>([])

  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string | null>(
    null
  )

  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string | null>(
    null
  )

  const getMediaDevices = async () => {
    try {
      setIsLoading(true)

      const devices = await navigator.mediaDevices.enumerateDevices()

      const videoDevs = devices
        .filter((device) => device.kind === 'videoinput')
        .map((device) => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${device.deviceId.slice(0, 4)}`,
        }))

      const audioDevs = devices
        .filter((device) => device.kind === 'audioinput')
        .map((device) => ({
          deviceId: device.deviceId,
          label: device.label || `Microphone ${device.deviceId.slice(0, 4)}`,
        }))

      setVideoDevices(videoDevs)
      setAudioDevices(audioDevs)

      // Set default devices if not already set
      if (!selectedVideoDevice && videoDevs.length > 0) {
        setSelectedVideoDevice(videoDevs[0].deviceId)
      }
      if (!selectedAudioDevice && audioDevs.length > 0) {
        setSelectedAudioDevice(audioDevs[0].deviceId)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to enumerate media devices'
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    navigator.mediaDevices.addEventListener('devicechange', getMediaDevices)

    getMediaDevices()

    return () => {
      navigator.mediaDevices.removeEventListener(
        'devicechange',
        getMediaDevices
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    isLoading,
    videoDevices,
    audioDevices,
    selectedVideoDevice,
    selectedAudioDevice,
    setSelectedVideoDevice,
    setSelectedAudioDevice,
    error,
  }
}
