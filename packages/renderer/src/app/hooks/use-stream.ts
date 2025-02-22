import { useEffect, useRef, useState } from 'react'

type StreamSize = { width: number; height: number } | null

export const useStream = (
  selectedVideoDevice: string | null,
  selectedAudioDevice: string | null
) => {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [streamError, setStreamError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [size, setSize] = useState<StreamSize>(null)

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

      await new Promise<void>((resolve) => {
        videoRef.current!.onloadedmetadata = () => {
          if (!videoRef.current) {
            resolve()
            return
          }

          setSize({
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
          })

          resolve()
        }
      })

      setStream(mediaStream)
    } catch (err) {
      console.error(err)

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

  return {
    stream,
    error: streamError,
    isLoading,
    startStream,
    stopStream,
    size,
  }
}
