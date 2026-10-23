import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { env } from '../config/env'
import { trackRequest } from './slow-requests'

/** Error body returned by the API: `{ message, errors? }` (see API README). */
type ApiErrorBody = {
  message?: string
  errors?: Record<string, string[]>
}

/** Normalized error for any failed API call, with messages ready to show to the user. */
export class ApiError extends Error {
  /** HTTP status, or 0 when the server couldn't be reached. */
  readonly status: number
  /** Validation messages by field, when the API returned 400 with `errors`. */
  readonly fieldErrors: Record<string, string[]>

  constructor(message: string, status: number, fieldErrors: Record<string, string[]> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

type TrackedConfig = InternalAxiosRequestConfig & { settle?: () => void }

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  // Generous because a cold start on the free tier can take close to a minute.
  timeout: 90_000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config: TrackedConfig) => {
  config.settle = trackRequest()
  return config
})

apiClient.interceptors.response.use(
  (response) => {
    ;(response.config as TrackedConfig).settle?.()
    return response
  },
  (error: unknown) => {
    if (error instanceof AxiosError) {
      ;(error.config as TrackedConfig | undefined)?.settle?.()
    }
    return Promise.reject(toApiError(error))
  },
)

function toApiError(error: unknown): ApiError {
  if (!(error instanceof AxiosError)) {
    return new ApiError('Ocurrió un error inesperado', 0)
  }

  if (!error.response) {
    const message =
      error.code === AxiosError.ECONNABORTED
        ? 'El servidor tardó demasiado en responder. Intente de nuevo.'
        : 'No se pudo conectar con el servidor. Verifique su conexión.'
    return new ApiError(message, 0)
  }

  const body = error.response.data as ApiErrorBody | undefined
  return new ApiError(
    body?.message ?? 'Ocurrió un error inesperado',
    error.response.status,
    body?.errors ?? {},
  )
}

/** Message to show for any error thrown by a query or mutation. */
export function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : 'Ocurrió un error inesperado'
}
