import React from 'react'
import { cn } from '../../utils/cn'
import { formatDuration } from '../../utils/format-duration'

type RecorderDurationProps = {
  duration: number
  isRecording: boolean
}

export const RecorderDuration: React.FC<RecorderDurationProps> = ({
  duration,
  isRecording,
}) => (
  <div
    className={cn(
      'flex items-center gap-2 rounded-full px-3 py-1.5 backdrop-blur-sm',
      'transition-all duration-300',
      isRecording ? 'bg-red-500/10 text-red-500' : 'bg-gray-900/80 text-white'
    )}
  >
    <div
      className={cn(
        'h-1.5 w-1.5 rounded-full',
        'transition-all duration-300',
        isRecording ? 'animate-pulse bg-red-500' : 'bg-white'
      )}
    />
    <span className="font-mono text-sm font-medium">
      {formatDuration(duration)}
    </span>
  </div>
)
