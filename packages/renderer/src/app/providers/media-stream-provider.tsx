import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from 'react'

type MediaStreamContextType = {
  stream: MediaStream | null
  error: string | null
  isLoading: boolean
  startStream(): void
  stopStream(): void
  size: { width: number; height: number } | null
}

const MediaStreamContext = createContext<MediaStreamContextType | null>(null)

type MediaStreamProviderProps = {
  children: ReactNode
}

export const MediaStreamProvider = ({ children }: MediaStreamProviderProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null
  )

  const startStream = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      videoRef.current = document.createElement('video')
      videoRef.current.srcObject = mediaStream

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
      setError(
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
    startStream()

    return stopStream
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MediaStreamContext.Provider
      value={{
        stream,
        error,
        isLoading,
        startStream,
        stopStream,
        size,
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
