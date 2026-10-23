import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { ApiError } from '../api/client'

/**
 * Shows the API's per-field validation messages (400 `errors`) on the matching form fields.
 * Returns true if at least one field got an error, so the caller can skip a generic toast.
 */
export function applyApiFieldErrors<TValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TValues>,
  fieldNames: readonly Path<TValues>[],
): boolean {
  if (!(error instanceof ApiError)) return false

  let applied = false
  for (const [field, messages] of Object.entries(error.fieldErrors)) {
    if ((fieldNames as readonly string[]).includes(field) && messages[0]) {
      setError(field as Path<TValues>, { type: 'server', message: messages[0] })
      applied = true
    }
  }
  return applied
}
