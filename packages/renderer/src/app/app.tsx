import { MediaPermissionsMiddleware } from './middlewares/media-permissions-middleware'
import { MediaStreamProvider } from './providers/media-stream-provider'
import { VideoRecorder } from './components/video-recorder'

export function App() {
  return (
    <MediaPermissionsMiddleware>
      <MediaStreamProvider>
        <div className="flex h-screen items-center justify-center bg-gray-100">
          <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg">
            <VideoRecorder />
          </div>
        </div>
      </MediaStreamProvider>
    </MediaPermissionsMiddleware>
  )
}
