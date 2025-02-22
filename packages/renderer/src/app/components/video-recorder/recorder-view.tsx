import React from 'react'
import { RecorderDuration } from './recorder-duration'
import { InputSourceSelector } from './input-source-selector'

type RecorderViewProps = {
  isRecording: boolean
  duration: number
  canvasRef: React.RefObject<HTMLCanvasElement | null>
}

export const RecorderView: React.FC<RecorderViewProps> = ({
  isRecording,
  duration,
  canvasRef,
}) => (
  <div className="relative overflow-hidden rounded-2xl bg-gray-800 shadow-2xl ring-1 ring-white/10">
    <canvas ref={canvasRef} className="h-full w-full" />

    <div className="absolute top-4 right-4">
      <RecorderDuration {...{ duration, isRecording }} />
    </div>

    {!isRecording && (
      <div className="absolute top-4 left-4">
        <InputSourceSelector />
      </div>
    )}
  </div>
)
