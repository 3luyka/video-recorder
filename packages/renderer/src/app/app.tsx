import { MediaPermissionsMiddleware } from './middlewares/media-permissions-middleware'
import { MediaStreamProvider } from './providers/media-stream-provider'
import { VideoRecorder } from './components/video-recorder'
import { VideoPlayer } from './components/video-player'
import { useEffect, useState } from 'react'
import { useSaveRecording } from './hooks/use-save-recording'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'

const animationProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 },
} as const

export function App() {
  const [data, setData] = useState<{
    video: Blob
    duration: number
    url: string
  } | null>(null)

  const { saveFile, isSaving } = useSaveRecording()

  const handleRecordingComplete = ({
    video,
    duration,
  }: {
    video: Blob
    duration: number
  }) => {
    const url = URL.createObjectURL(video)

    setData({ video, duration, url })
  }

  const handleSave = () => {
    if (!data) return

    saveFile(data.video)
  }

  const handleCancel = () => {
    setData(null)
  }

  useEffect(() => {
    return () => {
      if (!data) {
        return
      }

      URL.revokeObjectURL(data.url)
    }
  }, [data])

  return (
    <>
      <MediaPermissionsMiddleware>
        <MediaStreamProvider>
          <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg">
              <AnimatePresence mode="wait">
                {data ? (
                  <motion.div key="player" {...animationProps}>
                    <VideoPlayer
                      {...{ isSaving }}
                      src={data.url}
                      duration={data.duration}
                      onSave={handleSave}
                      onCancel={handleCancel}
                    />
                  </motion.div>
                ) : (
                  <motion.div key="recorder" {...animationProps}>
                    <VideoRecorder onComplete={handleRecordingComplete} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </MediaStreamProvider>
      </MediaPermissionsMiddleware>
      <Toaster />
    </>
  )
}
