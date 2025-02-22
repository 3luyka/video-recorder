import { useCanvasRenderer } from '../hooks/use-canvas-renderer'
import { useMediaRecorder } from '../hooks/use-media-recorder'
import { useMediaStream } from '../providers/media-stream-provider'

export const VideoRecorder = () => {
  const { stream, size } = useMediaStream()

  const { canvasRef } = useCanvasRenderer({
    stream,
    width: size?.width,
    height: size?.height,
  })

  const { isRecording, startRecording, stopRecording } = useMediaRecorder({
    stream,
    canvasRef,
  })

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording()
    } else {
      stopRecording()
    }
  }

  return (
    <div className="video-recorder">
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
          }}
        />
      </div>

      <div className="controls" style={{ marginTop: '20px' }}>
        <button onClick={toggleRecording}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
    </div>
  )
}
