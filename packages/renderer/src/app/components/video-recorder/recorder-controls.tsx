import React from 'react'
import { Button } from '../ui'
import { Video, StopCircle } from 'lucide-react'
import { cn } from '../../utils/cn'

type RecorderControlsProps = {
  isRecording: boolean
  startRecording(): void
  stopRecording(): void
}

export const RecorderControls: React.FC<RecorderControlsProps> = ({
  isRecording,
  startRecording,
  stopRecording,
}) => (
  <div className="mt-8 flex flex-wrap justify-center">
    <Button
      onClick={isRecording ? stopRecording : startRecording}
      color={isRecording ? 'danger' : 'primary'}
      className={cn(isRecording && 'animate-pulse')}
      icon={isRecording ? <StopCircle /> : <Video />}
    >
      {isRecording ? 'Stop Recording' : 'Start Recording'}
    </Button>
  </div>
)
