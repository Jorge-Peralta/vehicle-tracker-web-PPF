import { ChevronDown } from '@primeicons/react/chevron-down'
import { Times } from '@primeicons/react/times'
import { Select, type SelectValueChangeEvent } from '@primereact/ui/select'
import { useMemo, useState } from 'react'
import { fieldDescriptionId, fieldLabelId } from './field-ids'

export type SelectOption<TValue> = { value: TValue; label: string }

type SelectInputProps<TValue> = {
  /** Id of the trigger; also links it to the FormField label and messages. */
  inputId: string
  options: SelectOption<TValue>[]
  value: TValue | null
  onChange: (value: TValue | null) => void
  placeholder?: string
  /** Adds a search box above the options (filtering is done here, as PrimeReact 11 expects). */
  searchable?: boolean
  /** Shows a button to clear the selection. */
  clearable?: boolean
  invalid?: boolean
  disabled?: boolean
  emptyMessage?: string
  /** When there's no visible FormField label. */
  ariaLabel?: string
}

/** PrimeReact Select with the parts this app uses, wired for labels and validation. */
export function SelectInput<TValue extends string | number>({
  inputId,
  options,
  value,
  onChange,
  placeholder = 'Seleccione',
  searchable = false,
  clearable = false,
  invalid = false,
  disabled = false,
  emptyMessage = 'Sin resultados',
  ariaLabel,
}: SelectInputProps<TValue>) {
  const [filter, setFilter] = useState('')

  const visibleOptions = useMemo(() => {
    const query = filter.trim().toLowerCase()
    return query ? options.filter((option) => option.label.toLowerCase().includes(query)) : options
  }, [options, filter])

  return (
    <Select.Root
      value={value}
      options={visibleOptions}
      optionLabel="label"
      optionValue="value"
      optionKey="value"
      onValueChange={(event: SelectValueChangeEvent) => onChange((event.value as TValue) ?? null)}
      onOpenChange={() => setFilter('')}
      // Only pass `invalid` when true: PrimeReact forwards a false value to the DOM.
      invalid={invalid || undefined}
      disabled={disabled}
      fluid
    >
      <Select.Trigger
        id={inputId}
        aria-labelledby={ariaLabel ? undefined : fieldLabelId(inputId)}
        aria-label={ariaLabel}
        aria-describedby={fieldDescriptionId(inputId)}
        aria-invalid={invalid}
      >
        <Select.Value placeholder={placeholder} />
        {clearable && value !== null && (
          <Select.Clear aria-label="Quitar selección">
            <Times />
          </Select.Clear>
        )}
        <Select.Indicator>
          <ChevronDown />
        </Select.Indicator>
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            {searchable && (
              <Select.Header>
                <Select.Filter
                  value={filter}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFilter(event.target.value)
                  }
                  placeholder="Buscar…"
                  aria-label="Buscar opción"
                />
              </Select.Header>
            )}
            <Select.List style={{ maxHeight: '16rem' }} />
            <Select.Empty>{emptyMessage}</Select.Empty>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  )
}
