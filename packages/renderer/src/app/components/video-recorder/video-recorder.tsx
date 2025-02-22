import { useCanvasRenderer } from './_hooks/use-canvas-renderer'
import { useMediaRecorder } from './_hooks/use-media-recorder'
import { useMediaStream } from '../../providers/media-stream-provider'
import { RecorderControls } from './recorder-controls'
import { RecorderView } from './recorder-view'
import { useEffect } from 'react'
import { MIME_TYPE } from '../../../config'

type VideoRecorderProps = {
  onComplete: ({ video, duration }: { video: Blob; duration: number }) => void
}

export const VideoRecorder = ({ onComplete }: VideoRecorderProps) => {
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
      const video = new Blob(recordedChunks, { type: MIME_TYPE })

      onComplete({ video, duration })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordedChunks])

  return (
    <div>
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
