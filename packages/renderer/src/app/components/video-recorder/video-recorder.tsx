import { useCanvasRenderer } from './_hooks/use-canvas-renderer'
import { useMediaRecorder } from './_hooks/use-media-recorder'
import { useMediaStream } from '../../providers/media-stream-provider'
import { RecorderControls } from './recorder-controls'
import { RecorderView } from './recorder-view'

export const VideoRecorder = () => {
  const { stream, size } = useMediaStream()

  const { canvasRef } = useCanvasRenderer({
    stream,
    width: size?.width,
    height: size?.height,
  })

  const { isRecording, startRecording, stopRecording, duration } =
    useMediaRecorder({
      stream,
      canvasRef,
    })

  return (
    <div className="video-recorder-root">
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
