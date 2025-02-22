import React from 'react'
import { Button } from '../ui'
import { X, Save } from 'lucide-react'

type PlayerActionsProps = {
  onSave(): void
  onCancel(): void
  isSaving: boolean
}

export const PlayerActions: React.FC<PlayerActionsProps> = ({
  onCancel,
  onSave,
  isSaving,
}) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button icon={<X />} color="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        icon={<Save />}
        color="success"
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save'}
      </Button>
    </div>
  )
}
