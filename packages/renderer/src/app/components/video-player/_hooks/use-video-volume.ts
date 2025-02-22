import { useRef, useState } from 'react'

export const useVideoVolume = () => {
  const [volume, setVolume] = useState(1)
  const previousVolume = useRef(volume)

  const isMuted = volume === 0

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume.current)
    } else {
      previousVolume.current = volume

      setVolume(0)
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)

    if (newVolume > 0) {
      previousVolume.current = newVolume
    }
  }

  return {
    volume,
    isMuted,
    toggleMute,
    handleVolumeChange,
  }
}
