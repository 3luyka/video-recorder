import { useRef, useState } from 'react'

export const useVideoControls = (isPlaying: boolean) => {
  const [visible, setVisible] = useState(true)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const showControls = () => {
    setVisible(true)

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    if (!isPlaying) {
      return
    }

    controlsTimeoutRef.current = setTimeout(() => {
      setVisible(false)
    }, 2000)
  }

  const hideControls = () => {
    if (!isPlaying) {
      return
    }

    setVisible(false)
  }

  return {
    showControls,
    hideControls,
    visible,
  }
}
