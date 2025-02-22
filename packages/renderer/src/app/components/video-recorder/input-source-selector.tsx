import React, { useEffect, useRef } from 'react'
import { useMediaStream } from '../../providers/media-stream-provider'
import { Settings } from 'lucide-react'
import { Select } from '../ui'

export const InputSourceSelector: React.FC = () => {
  const {
    videoDevices,
    audioDevices,
    selectedVideoDevice,
    selectedAudioDevice,
    setSelectedVideoDevice,
    setSelectedAudioDevice,
  } = useMediaStream()

  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (videoDevices.length === 0 && audioDevices.length === 0) {
    return null
  }

  return (
    <div ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center gap-2 rounded-full bg-gray-900/80 px-3 py-1.5 text-white backdrop-blur-sm transition-all duration-300 hover:bg-gray-900/90"
      >
        <Settings className="h-4 w-4" />
        <span className="text-sm">Settings</span>
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 z-10 flex w-64 flex-col gap-3 rounded-lg bg-white p-4 shadow-lg">
          {videoDevices.length > 0 && (
            <Select
              label="Camera"
              options={videoDevices.map((device) => ({
                value: device.deviceId,
                label: device.label,
              }))}
              value={selectedVideoDevice}
              onChange={setSelectedVideoDevice}
            />
          )}

          {audioDevices.length > 0 && (
            <Select
              label="Microphone"
              options={audioDevices.map((device) => ({
                value: device.deviceId,
                label: device.label,
              }))}
              value={selectedAudioDevice}
              onChange={setSelectedAudioDevice}
            />
          )}
        </div>
      )}
    </div>
  )
}
