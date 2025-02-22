import { MediaPermissionsMiddleware } from './components/media-permissions-middleware'

export function App() {
  return (
    <MediaPermissionsMiddleware>
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg">
          Good!
        </div>
      </div>
    </MediaPermissionsMiddleware>
  )
}
