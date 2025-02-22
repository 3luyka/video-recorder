import { useRef, useState, useEffect } from 'react'
import { MIME_TYPE } from '../../config'

type UseMediaRecorderProps = {
  stream: MediaStream | null
  canvasRef: React.RefObject<HTMLCanvasElement | null>
}

export const useMediaRecorder = ({
  stream,
  canvasRef,
}: UseMediaRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const recordingStartTime = useRef<number | null>(null)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const startRecording = () => {
    if (!stream || !canvasRef.current) return

    const outputStream = canvasRef.current.captureStream(60)

    const combinedStream = new MediaStream([
      ...outputStream.getTracks(),
      ...stream.getAudioTracks(),
    ])

    const mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType: MIME_TYPE,
    })

    mediaRecorderRef.current = mediaRecorder

    setRecordedChunks([])

    mediaRecorder.ondataavailable = (event) => {
      setRecordedChunks((prev) => [...prev, event.data])
    }

    mediaRecorder.start()

    setIsRecording(true)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (isRecording) {
      recordingStartTime.current = Date.now()

      intervalId = setInterval(() => {
        const elapsed = Date.now() - (recordingStartTime.current || 0)

        setDuration(Math.floor(elapsed / 1000))
      }, 1000)
    } else {
      recordingStartTime.current = null
      setDuration(0)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isRecording])

  return {
    isRecording,
    recordedChunks,
    startRecording,
    stopRecording,
    duration,
  }
}
