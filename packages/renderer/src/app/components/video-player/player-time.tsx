import React from 'react'
import { formatDuration } from '../../utils/format-duration'

type PlayerTimeProps = {
  currentTime: number
  duration: number
}

export const PlayerTime: React.FC<PlayerTimeProps> = ({
  currentTime,
  duration,
}) => (
  <div className="text-sm font-medium text-white">
    {formatDuration(currentTime)} / {formatDuration(duration)}
  </div>
)
