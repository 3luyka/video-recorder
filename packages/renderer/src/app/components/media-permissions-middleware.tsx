import React from 'react'
import { LoaderCircle } from 'lucide-react'
import { useMediaPermissions } from '../hooks/use-media-permissions'
import { Button } from './ui/button'

type MediaPermissionsMiddlewareProps = {
  children: React.ReactNode
}

export const MediaPermissionsMiddleware: React.FC<
  MediaPermissionsMiddlewareProps
> = ({ children }) => {
  const { permissions, isLoading, checkPermissions, requestPermissions } =
    useMediaPermissions()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderCircle className="h-10 w-10 animate-spin text-gray-600" />
      </div>
    )
  }

  if (permissions.error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="max-w-md rounded-lg bg-red-50 p-6 text-center">
          <div className="mb-3 text-lg font-semibold text-red-800">
            Permission Error
          </div>
          <div className="mb-4 text-red-600">{permissions.error}</div>
          <Button onClick={checkPermissions} color="danger">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (
    permissions.camera === 'granted' &&
    permissions.microphone === 'granted'
  ) {
    return <>{children}</>
  }

  const deniedDevices = []

  if (permissions.camera === 'denied' || permissions.camera === 'restricted') {
    deniedDevices.push('Camera')
  }

  if (
    permissions.microphone === 'denied' ||
    permissions.microphone === 'restricted'
  ) {
    deniedDevices.push('Microphone')
  }

  // TODO: avoid copy-paste
  if (deniedDevices.length > 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
          <div className="mb-4 text-lg font-semibold text-gray-900">
            Permission Required
          </div>
          <div className="mb-6 text-gray-600">
            {deniedDevices.join(' and ')} access{' '}
            {deniedDevices.length > 1 ? 'are' : 'is'} denied. Please enable{' '}
            {deniedDevices.length > 1 ? 'them' : 'it'} in your system
            preferences to use the video recorder.
          </div>
          <Button onClick={checkPermissions} disabled={isLoading}>
            Check Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
        <div className="mb-4 text-lg font-semibold text-gray-900">
          Camera and Microphone Access Required
        </div>
        <div className="mb-6 text-gray-600">
          To use the video recorder, please allow access to your camera and
          microphone.
        </div>
        <Button onClick={requestPermissions} disabled={isLoading}>
          Grant Access
        </Button>
      </div>
    </div>
  )
}
