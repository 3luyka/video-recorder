import React from 'react'
import { Play } from 'lucide-react'
import { cn } from '../../utils/cn'

type PlayButtonProps = {
  isPlaying: boolean
  togglePlay: () => void
}

export const PlayerPlayButton: React.FC<PlayButtonProps> = ({
  isPlaying,
  togglePlay,
}) => (
  <div
    className={cn(
      'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform',
      'transition-opacity duration-200',
      isPlaying ? 'opacity-0' : 'opacity-100'
    )}
  >
    <button
      onClick={togglePlay}
      className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/30"
    >
      <Play className="h-10 w-10 text-white" fill="currentColor" />
    </button>
  </div>
)
