import { useState, useEffect, useRef } from 'react'

type VideoPlayerProps = {
  volume: number
  isFullscreen: boolean
}

export const useVideoPlayer = ({ volume, isFullscreen }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [bufferProgress, setBufferProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    const timeUpdate = () => {
      setCurrentTime(video.currentTime)

      if (!video.buffered.length) {
        return
      }

      setBufferProgress(
        (video.buffered.end(video.buffered.length - 1) / video.duration) * 100
      )
    }

    const handlePlay = () => setIsPlaying(true)

    const handlePause = () => setIsPlaying(false)

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)

      if (!videoRef.current) {
        return
      }

      videoRef.current.currentTime = 0
    }

    video.addEventListener('timeupdate', timeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', timeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
  }

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return

    const rect = e.currentTarget.getBoundingClientRect()
    const pos = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)

    videoRef.current.currentTime = pos * videoRef.current.duration
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

  useEffect(() => {
    if (!videoRef.current) return

    videoRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    if (!isFullscreen) return

    videoRef.current?.requestFullscreen()
  }, [isFullscreen])

  return {
    videoRef,
    isPlaying,
    currentTime,
    bufferProgress,
    isDragging,
    togglePlay,
    handleProgressMouseDown,
    handleProgressMouseUp,
    handleProgressMouseMove,
  }
}
