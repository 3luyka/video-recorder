import { useCanvasRenderer } from './_hooks/use-canvas-renderer'
import { useMediaRecorder } from './_hooks/use-media-recorder'
import { useMediaStream } from '../../providers/media-stream-provider'
import { RecorderControls } from './recorder-controls'
import { RecorderView } from './recorder-view'
import { useEffect } from 'react'

type VideoRecorderProps = {
  onSave: ({ video, duration }: { video: Blob; duration: number }) => void
}

export const VideoRecorder = ({ onSave }: VideoRecorderProps) => {
  const { stream, size } = useMediaStream()

  const { canvasRef } = useCanvasRenderer({
    stream,
    width: size?.width,
    height: size?.height,
  })

  const {
    isRecording,
    startRecording,
    stopRecording,
    duration,
    recordedChunks,
  } = useMediaRecorder({
    stream,
    canvasRef,
  })

  useEffect(() => {
    if (recordedChunks.length > 0 && !isRecording) {
      const video = new Blob(recordedChunks, { type: 'video/webm' })

      onSave({ video, duration })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordedChunks])

  return (
    <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg">
      <RecorderView
        {...{
          isRecording,
          duration,
          canvasRef,
        }}
      />

      <RecorderControls
        {...{
          isRecording,
          startRecording,
          stopRecording,
        }}
      />
    </div>
  )
}
