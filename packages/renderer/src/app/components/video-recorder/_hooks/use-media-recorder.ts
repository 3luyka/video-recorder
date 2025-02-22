import { useRef, useState, useEffect } from 'react'
import { MIME_TYPE } from '../../../../config'

type UseMediaRecorderProps = {
  stream: MediaStream | null
  canvasRef: React.RefObject<HTMLCanvasElement | null>
}

export const useMediaRecorder = ({
  stream,
  canvasRef,
}: UseMediaRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false)
  const [, setDuration] = useState(0)
  const startTime = useRef(0)
  const durationInterval = useRef<NodeJS.Timeout | null>(null)
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

    startTime.current = Date.now()

    durationInterval.current = setInterval(() => {
      setDuration((val) => val + 1)
    }, 1000)

    setIsRecording(true)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()

      setIsRecording(false)

      if (durationInterval.current) {
        clearInterval(durationInterval.current)
      }
    }
  }

  useEffect(() => {
    return () => {
      if (!durationInterval.current) {
        return
      }

      clearInterval(durationInterval.current)
    }
  }, [])

  return {
    isRecording,
    recordedChunks,
    startRecording,
    stopRecording,
    duration: startTime.current ? (Date.now() - startTime.current) / 1000 : 0,
  }
}
