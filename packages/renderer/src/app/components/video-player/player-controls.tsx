import React from 'react'
import { PlayerVolumeControl } from './player-volume-control'
import { PlayerTime } from './player-time'
import { Minimize, PauseIcon, PlayIcon } from 'lucide-react'
import { Maximize } from 'lucide-react'

type PlayerControlsProps = {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isFullscreen: boolean
  isMuted: boolean
  onPlayPause(): void
  onVolumeChange(value: number): void
  onToggleMute(): void
  onToggleFullscreen(): void
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isFullscreen,
  isMuted,
  onPlayPause,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
}) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex items-center gap-4">
      <button
        onClick={onPlayPause}
        className="cursor-pointer text-white transition-colors hover:text-blue-500"
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <PlayerTime {...{ currentTime, duration }} />

      <PlayerVolumeControl
        {...{ volume, isMuted }}
        onVolumeChange={onVolumeChange}
        onToggleMute={onToggleMute}
      />
    </div>

    <div className="flex items-center gap-4">
      <button
        onClick={onToggleFullscreen}
        className="cursor-pointer text-white transition-colors hover:text-blue-500"
      >
        {isFullscreen ? <Minimize /> : <Maximize />}
      </button>
    </div>
  </div>
)
