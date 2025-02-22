import { useEffect, useRef, RefObject } from 'react'

interface UseCanvasRendererProps {
  videoRef: RefObject<HTMLVideoElement | null>
}

export const useCanvasRenderer = ({ videoRef }: UseCanvasRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current

    if (!canvas || !video) {
      return
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    const renderFrame = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
    }

    const handleTimeUpdate = () => {
      renderFrame()
    }

    const render = () => {
      if (video.paused || video.ended) {
        return
      }

      renderFrame()
      animationFrameRef.current = requestAnimationFrame(render)
    }

    video.addEventListener('loadeddata', renderFrame)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', render)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      video.removeEventListener('loadeddata', renderFrame)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', render)
    }
  }, [videoRef])

  return { canvasRef }
}
