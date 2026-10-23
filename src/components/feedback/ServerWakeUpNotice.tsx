import { Spinner } from '@primeicons/react/spinner'
import { useSyncExternalStore } from 'react'
import { hasSlowRequests, subscribeToSlowRequests } from '../../api/slow-requests'
import './ServerWakeUpNotice.scss'

/**
 * Shown while any API request is taking unusually long, which on the free hosting tier
 * almost always means the server is waking up after being idle.
 */
export function ServerWakeUpNotice() {
  const isWaitingForServer = useSyncExternalStore(subscribeToSlowRequests, hasSlowRequests)

  if (!isWaitingForServer) return null

  return (
    <div className="server-wake-up-notice" role="status" aria-live="polite">
      <Spinner className="server-wake-up-notice__icon" aria-hidden="true" />
      <span>
        Despertando el servidor… La primera carga puede tardar hasta un minuto en el plan gratuito.
      </span>
    </div>
  )
}
