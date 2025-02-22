import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from 'react'
import { useMediaDevices } from '../hooks/use-media-devices'

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
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [streamError, setStreamError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null
  )

  const {
    videoDevices,
    audioDevices,
    selectedVideoDevice,
    selectedAudioDevice,
    setSelectedVideoDevice,
    setSelectedAudioDevice,
    error: devicesError,
  } = useMediaDevices()

  const startStream = async () => {
    try {
      setIsLoading(true)
      setStreamError(null)

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: selectedVideoDevice
          ? { deviceId: { exact: selectedVideoDevice } }
          : true,
        audio: selectedAudioDevice
          ? { deviceId: { exact: selectedAudioDevice } }
          : true,
      })

      videoRef.current = document.createElement('video')
      videoRef.current.srcObject = mediaStream
      videoRef.current.playsInline = true
      videoRef.current.muted = true

      videoRef.current.onloadedmetadata = () => {
        if (!videoRef.current) {
          return
        }

        setSize({
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        })
      }

      setStream(mediaStream)
    } catch (err) {
      setStreamError(
        err instanceof Error ? err.message : 'Failed to start media stream'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const stopStream = () => {
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    if (!stream) {
      return
    }

    stream.getTracks().forEach((track) => track.stop())

    setStream(null)
  }

  useEffect(() => {
    if (!stream) {
      return
    }

    stopStream()
    startStream()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVideoDevice, selectedAudioDevice])

  useEffect(() => {
    startStream()

    return stopStream
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
