import {
  AutoComplete,
  type AutoCompleteCompleteEvent,
  type AutoCompleteInputValueChangeEvent,
  type AutoCompleteValueChangeEvent,
} from '@primereact/ui/autocomplete'
import { InputText } from '@primereact/ui/inputtext'
import { useState } from 'react'
import type { Driver } from '../../../api/types'
import { fieldDescriptionId } from '../../../components/form/field-ids'
import { useDebouncedValue } from '../../../lib/use-debounced-value'
import { useDrivers } from '../../drivers/drivers-api'

type DriverNameInputProps = {
  inputId: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  invalid?: boolean
}

/**
 * Free-text driver name with suggestions from existing drivers. Picking a suggestion reuses
 * that driver's spelling; a new name creates the driver when the movement is saved.
 */
export function DriverNameInput({
  inputId,
  value,
  onChange,
  onBlur,
  invalid,
}: DriverNameInputProps) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query.trim(), 250)
  const { data: drivers = [] } = useDrivers(debouncedQuery)

  return (
    <AutoComplete.Root
      options={drivers}
      optionLabel="fullName"
      value={null}
      inputValue={value}
      onComplete={(event: AutoCompleteCompleteEvent) => setQuery(event.query)}
      onInputValueChange={(event: AutoCompleteInputValueChangeEvent) => onChange(event.query)}
      onValueChange={(event: AutoCompleteValueChangeEvent) => {
        // The picked option may come as the driver object or as its label.
        const picked: unknown = event.value
        if (typeof picked === 'string') onChange(picked)
        else if (picked && typeof picked === 'object') onChange((picked as Driver).fullName)
      }}
      fluid
    >
      <AutoComplete.Input
        as={InputText}
        id={inputId}
        onBlur={onBlur}
        placeholder="Ej.: Ana López"
        autoComplete="off"
        // `invalid` goes on the input (InputText styles it); on Root it leaks to the DOM.
        invalid={invalid}
        aria-invalid={invalid}
        aria-describedby={fieldDescriptionId(inputId)}
        fluid
      />
      <AutoComplete.Portal>
        <AutoComplete.Positioner>
          <AutoComplete.Popup>
            {/* Options rendered explicitly so each has a stable key (the default list keys by object). */}
            <AutoComplete.List style={{ maxHeight: '14rem' }}>
              {drivers.map((driver, index) => (
                <AutoComplete.Option key={driver.id} index={index} uKey={driver.id}>
                  {driver.fullName}
                </AutoComplete.Option>
              ))}
            </AutoComplete.List>
            <AutoComplete.Empty>Conductor nuevo: se registrará al guardar.</AutoComplete.Empty>
          </AutoComplete.Popup>
        </AutoComplete.Positioner>
      </AutoComplete.Portal>
    </AutoComplete.Root>
  )
}
