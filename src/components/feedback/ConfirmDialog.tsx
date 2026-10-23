import { ExclamationTriangle } from '@primeicons/react/exclamation-triangle'
import { Button } from '@primereact/ui/button'
import { Dialog, type DialogRootChangeEvent } from '@primereact/ui/dialog'
import type { ReactNode } from 'react'
import './ConfirmDialog.scss'

type ConfirmDialogProps = {
  open: boolean
  title: string
  message: ReactNode
  confirmLabel: string
  /** Shows the confirm button as busy and keeps the dialog open while the action runs. */
  isConfirming?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Controlled confirmation dialog for destructive actions.
 * (PrimeReact 11 has no ConfirmDialog; it's composed from Dialog parts.)
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root
      open={open}
      modal
      onOpenChange={(event: DialogRootChangeEvent) => {
        if (!event.value && !isConfirming) onCancel()
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Popup className="confirm-dialog" role="alertdialog">
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Content>
              <div className="confirm-dialog__body">
                <ExclamationTriangle className="confirm-dialog__icon" aria-hidden="true" />
                <div>{message}</div>
              </div>
            </Dialog.Content>
            <Dialog.Footer>
              <Button
                severity="secondary"
                variant="text"
                onClick={onCancel}
                disabled={isConfirming}
              >
                Cancelar
              </Button>
              <Button severity="danger" onClick={onConfirm} disabled={isConfirming}>
                {isConfirming ? 'Procesando…' : confirmLabel}
              </Button>
            </Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Positioner>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
