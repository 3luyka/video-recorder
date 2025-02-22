import { useState } from 'react'
import { saveRecording } from '@vite-electron-builder/preload'
import toast from 'react-hot-toast'
import { MIME_TYPE } from '../../config'

export function useSaveRecording() {
  const [isSaving, setIsSaving] = useState(false)

  const saveFile = async (blob: Blob) => {
    if (isSaving) {
      return
    }

    try {
      setIsSaving(true)

      const buffer = await blob.arrayBuffer()
      const fileName = `video-${Date.now()}`
      const result = await saveRecording(buffer, fileName, MIME_TYPE)

      if (!result.success) {
        toast.error('Failed to save file')
        return
      }

      toast.success('File saved successfully')
    } catch (error) {
      console.error('Error saving file:', error)

      toast.error('Error saving file')
    } finally {
      setIsSaving(false)
    }
  }

  return { saveFile, isSaving }
}
