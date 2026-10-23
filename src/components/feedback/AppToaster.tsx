import { Check } from '@primeicons/react/check'
import { ExclamationTriangle } from '@primeicons/react/exclamation-triangle'
import { InfoCircle } from '@primeicons/react/info-circle'
import { Times } from '@primeicons/react/times'
import { Toast } from '@primereact/ui/toast'
import { Toaster, type ToasterRegionInstance, type ToastType } from '@primereact/ui/toaster'

/**
 * Renders the toasts raised anywhere with `toast.success(...)` / `toast.error(...)`
 * from `@primereact/ui/toaster`. Mounted once, in the app layout.
 */
export function AppToaster() {
  return (
    <Toaster.Root position="top-right" timeout={4000}>
      <Toaster.Portal>
        <Toaster.Region>
          {({ toaster }: ToasterRegionInstance) =>
            toaster?.toasts.map((toast: ToastType) => (
              <Toast.Root key={toast.id} toast={toast}>
                <Toast.Content>
                  <Toast.Icon match="success">
                    <Check />
                  </Toast.Icon>
                  <Toast.Icon match="error">
                    <Times />
                  </Toast.Icon>
                  <Toast.Icon match="warn">
                    <ExclamationTriangle />
                  </Toast.Icon>
                  <Toast.Icon match="info">
                    <InfoCircle />
                  </Toast.Icon>
                  <Toast.Message>
                    <Toast.Title />
                    <Toast.Description />
                  </Toast.Message>
                  <Toast.Close aria-label="Cerrar notificación">
                    <Times />
                  </Toast.Close>
                </Toast.Content>
              </Toast.Root>
            ))
          }
        </Toaster.Region>
      </Toaster.Portal>
    </Toaster.Root>
  )
}
