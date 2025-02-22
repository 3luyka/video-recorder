import React, { useState } from 'react'
import { cn } from '../../utils/cn'

type PlayerTimelineProps = {
  currentTime: number
  duration: number
  bufferProgress: number
  onProgressChange(position: number): void
}

export const PlayerTimeline: React.FC<PlayerTimelineProps> = ({
  currentTime,
  duration,
  bufferProgress,
  onProgressChange,
}) => {
  const progress = (currentTime / duration) * 100
  const [isDragging, setIsDragging] = useState(false)

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pos = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)

    onProgressChange(pos)
  }

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    handleProgressChange(e)
  }

  const handleProgressMouseUp = () => {
    setIsDragging(false)
  }

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return
    }

    handleProgressChange(e)
  }

  return (
    <div
      className="group/progress relative mb-4 h-1.5 cursor-pointer"
      onMouseDown={handleProgressMouseDown}
      onMouseMove={handleProgressMouseMove}
      onMouseUp={handleProgressMouseUp}
      onMouseLeave={handleProgressMouseUp}
    >
      <div
        className="absolute h-full rounded-full bg-white/20"
        style={{ width: `${bufferProgress}%` }}
      />

      <div
        className="absolute h-full rounded-full bg-blue-500"
        style={{
          width: `${progress}%`,
        }}
      />

      <div className="absolute h-full w-full rounded-full bg-white/0 transition-colors group-hover/progress:bg-white/10" />

      <div
        className={cn(
          'absolute top-1/2 -ml-2 h-4 w-4 -translate-y-1/2 transform rounded-full bg-blue-500 transition-transform',
          'opacity-0 group-hover/progress:opacity-100',
          isDragging && 'scale-110 opacity-100'
        )}
        style={{
          left: `${progress}%`,
        }}
      />
    </div>
  )
}
