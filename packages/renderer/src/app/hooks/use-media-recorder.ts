import { useRef, useState } from 'react'
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

  return {
    isRecording,
    recordedChunks,
    startRecording,
    stopRecording,
  }
}
