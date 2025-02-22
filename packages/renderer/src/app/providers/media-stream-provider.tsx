import { createContext, useContext, ReactNode } from 'react'
import { useMediaDevices } from '../hooks/use-media-devices'
import { useStream } from '../hooks/use-stream'

type MediaDevice = {
  deviceId: string
  label: string
}

type MediaStreamContextType = {
  stream: MediaStream | null
  error: string | null
  isLoading: boolean
  startStream(): void
  stopStream(): void
  size: { width: number; height: number } | null
  videoDevices: MediaDevice[]
  audioDevices: MediaDevice[]
  selectedVideoDevice: string | null
  selectedAudioDevice: string | null
  setSelectedVideoDevice(deviceId: string): void
  setSelectedAudioDevice(deviceId: string): void
}

const MediaStreamContext = createContext<MediaStreamContextType | null>(null)

type MediaStreamProviderProps = {
  children: ReactNode
}

export const MediaStreamProvider = ({ children }: MediaStreamProviderProps) => {
  const {
    videoDevices,
    audioDevices,
    selectedVideoDevice,
    selectedAudioDevice,
    setSelectedVideoDevice,
    setSelectedAudioDevice,
    error: devicesError,
  } = useMediaDevices()

  const {
    stream,
    error: streamError,
    isLoading,
    startStream,
    stopStream,
    size,
  } = useStream(selectedVideoDevice, selectedAudioDevice)

  return (
    <MediaStreamContext.Provider
      value={{
        stream,
        error: streamError || devicesError,
        isLoading,
        startStream,
        stopStream,
        size,
        videoDevices,
        audioDevices,
        selectedVideoDevice,
        selectedAudioDevice,
        setSelectedVideoDevice,
        setSelectedAudioDevice,
      }}
    >
      {children}
    </MediaStreamContext.Provider>
  )
}

export const useMediaStream = () => {
  const context = useContext(MediaStreamContext)

  if (!context) {
    throw new Error('useMediaStream must be used within a MediaStreamProvider')
  }

  return context
}
