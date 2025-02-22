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
      <video
        ref={videoRef}
        src={src}
        className="hidden"
        playsInline
        preload="auto"
      />

      <canvas
        ref={canvasRef}
        className="w-full cursor-pointer bg-black"
        onClick={onPlay}
        onDoubleClick={onFullscreen}
      />
    </>
  )
}
