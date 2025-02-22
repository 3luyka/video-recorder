import React from 'react'
import { VolumeX, Volume2, Volume1 } from 'lucide-react'

type PlayerVolumeControlProps = {
  volume: number
  isMuted: boolean
  onVolumeChange(value: number): void
  onToggleMute(): void
}

export const PlayerVolumeControl: React.FC<PlayerVolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}) => (
  <div className="group/volume flex items-center gap-2">
    <button
      onClick={onToggleMute}
      className="cursor-pointer text-white transition-colors hover:text-blue-500"
    >
      {isMuted || isMuted ? (
        <VolumeX />
      ) : volume > 0.5 ? (
        <Volume2 />
      ) : (
        <Volume1 />
      )}
    </button>
    <div className="w-0 overflow-hidden transition-all duration-200 group-hover/volume:w-24">
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        className="w-24 cursor-pointer accent-blue-500"
      />
    </div>
  </div>
)
