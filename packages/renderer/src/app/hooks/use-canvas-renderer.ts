import { useEffect, useRef } from 'react'

type UseCanvasRendererProps = {
  stream: MediaStream | null
  width?: number
  height?: number
}

export const useCanvasRenderer = ({
  stream,
  width = 1280,
  height = 720,
}: UseCanvasRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!stream) return

    if (!videoRef.current) {
      videoRef.current = document.createElement('video')
      videoRef.current.playsInline = true
      videoRef.current.muted = true
    }

    videoRef.current.srcObject = stream
    videoRef.current.play().catch(console.error)

    const renderFrame = () => {
      const canvas = canvasRef.current
      const video = videoRef.current

      if (canvas && video) {
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          return
        }

        ctx.save()

        ctx.scale(-1, 1)
        ctx.translate(-canvas.width, 0)
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        ctx.restore()
      }

      animationFrameRef.current = requestAnimationFrame(renderFrame)
    }

    renderFrame()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }, [stream])

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    canvas.width = width
    canvas.height = height
  }, [width, height])

  return { canvasRef }
}
