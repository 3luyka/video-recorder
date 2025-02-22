import React, { RefObject } from 'react'
import { useCanvasRenderer } from './_hooks/use-canvas-renderer'

type PlayerViewProps = {
  src: string
  videoRef: RefObject<HTMLVideoElement | null>
  onPlay(): void
  onFullscreen(): void
}

export const PlayerView: React.FC<PlayerViewProps> = ({
  src,
  videoRef,
  onPlay,
  onFullscreen,
}) => {
  const { canvasRef } = useCanvasRenderer({ videoRef })

  return (
    <>
      <video ref={videoRef} src={src} className="hidden" playsInline />

      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-pointer rounded-xl bg-black"
        onClick={onPlay}
        onDoubleClick={onFullscreen}
      />
    </>
  )
}
