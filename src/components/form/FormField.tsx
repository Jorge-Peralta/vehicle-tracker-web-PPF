import type { ReactNode } from 'react'
import { fieldDescriptionId } from './field-ids'
import './FormField.scss'

type FormFieldProps = {
  /** Id of the input, so the label and error message are linked to it. */
  inputId: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: ReactNode
}

/**
 * Label + input + hint/error, laid out consistently. The input should set
 * `aria-describedby={fieldDescriptionId(inputId)}` and `invalid` when there is an error.
 */
export function FormField({ inputId, label, required, error, hint, children }: FormFieldProps) {
  const descriptionId = fieldDescriptionId(inputId)

  return (
    <div className="form-field">
      <label htmlFor={inputId} className="form-field__label">
        {label}
        {required && (
          <span className="form-field__required" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <small id={descriptionId} className="form-field__error" role="alert">
          {error}
        </small>
      ) : (
        hint && (
          <small id={descriptionId} className="form-field__hint">
            {hint}
          </small>
        )
      )}
    </div>
  )
}
