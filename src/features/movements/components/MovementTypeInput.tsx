import type { MovementType } from '../../../api/types'
import { movementTypeOptions } from '../movement-labels'
import './MovementTypeInput.scss'

type MovementTypeInputProps = {
  name: string
  value: MovementType
  onChange: (value: MovementType) => void
  /** Type expected by the alternation rule; marked as suggested. */
  suggested?: MovementType
  invalid?: boolean
  describedBy?: string
}

/** Entry/exit choice as a two-option segmented control (native radios, keyboard accessible). */
export function MovementTypeInput({
  name,
  value,
  onChange,
  suggested,
  invalid,
  describedBy,
}: MovementTypeInputProps) {
  return (
    <div
      className={`movement-type-input${invalid ? ' movement-type-input--invalid' : ''}`}
      role="radiogroup"
      aria-labelledby={`${name}-label`}
      aria-describedby={describedBy}
    >
      {movementTypeOptions.map((option) => (
        <label
          key={option.value}
          className={`movement-type-input__option movement-type-input__option--${option.value.toLowerCase()}`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span>
            {option.label}
            {suggested === option.value && (
              <small className="movement-type-input__hint"> (sugerido)</small>
            )}
          </span>
        </label>
      ))}
    </div>
  )
}
