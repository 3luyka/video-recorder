import React from 'react'
import { cn } from '../../utils/cn'
import { PlayerControls } from './player-controls'
import { PlayerTimeline } from './player-timeline'
import { PlayerPlayButton } from './player-play-button'
import { useVideoVolume } from './_hooks/use-video-volume'
import { useVideoFullscreen } from './_hooks/use-video-fullscreen'
import { useVideoPlayer } from './_hooks/use-video-player'
import { useVideoControls } from './_hooks/use-video-controls'
import { PlayerActions } from './player-actions'
import { PlayerView } from './player-view'
import { useMediaStream } from '../../providers/media-stream-provider'

type VideoPlayerProps = {
  src: string
  onSave(): void
  onCancel(): void
  duration: number
  isSaving: boolean
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  duration,
  onCancel,
  onSave,
  isSaving,
}) => {
  const { size } = useMediaStream()

  const { volume, isMuted, toggleMute, handleVolumeChange } = useVideoVolume()
  const { isFullscreen, toggleFullscreen } = useVideoFullscreen()

  const { videoRef, isPlaying, togglePlay, currentTime, bufferProgress } =
    useVideoPlayer({ volume, isFullscreen })

  const {
    showControls,
    hideControls,
    visible: controlsVisible,
  } = useVideoControls(isPlaying)

  const handleProgressChange = (position: number) => {
    if (!videoRef.current) return

    videoRef.current.currentTime = position * duration
  }

  // const handleLoadedMetadata = () => {
  //   if (!videoRef.current) return
  //   setVideoDimensions({
  //     width: videoRef.current.videoWidth,
  //     height: videoRef.current.videoHeight,
  //   })
  // }

  const containerStyle = {
    maxWidth: size?.width ? `${size.width}px` : '64rem',
    maxHeight: size?.height ? `${size.height}px` : 'auto',
  }

  return (
    <div
      className="w-full rounded-lg bg-white p-6 shadow-lg"
      style={containerStyle}
    >
      <div className="flex flex-col gap-6">
        <div
          className="group relative h-full w-full"
          onMouseMove={showControls}
          onMouseLeave={hideControls}
        >
          <PlayerView
            {...{
              src,
              videoRef,
            }}
            onPlay={togglePlay}
            onFullscreen={toggleFullscreen}
          />

          <PlayerPlayButton {...{ isPlaying, togglePlay }} />

          <div
            className={cn(
              'absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pt-20 pb-4',
              'transition-opacity duration-200',
              controlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'
            )}
          >
            <PlayerTimeline
              {...{ duration, currentTime, bufferProgress }}
              onProgressChange={handleProgressChange}
            />

            <PlayerControls
              {...{
                isPlaying,
                currentTime,
                duration,
                volume,
                isFullscreen,
                isMuted,
              }}
              onPlayPause={togglePlay}
              onVolumeChange={handleVolumeChange}
              onToggleMute={toggleMute}
              onToggleFullscreen={toggleFullscreen}
            />
          </div>
        </div>

        <PlayerActions
          {...{
            onCancel,
            onSave,
            isSaving,
          }}
        />
      </div>
    </div>
  )
}
