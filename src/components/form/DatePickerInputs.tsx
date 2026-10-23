import { ChevronDown } from '@primeicons/react/chevron-down'
import { ChevronLeft } from '@primeicons/react/chevron-left'
import { ChevronRight } from '@primeicons/react/chevron-right'
import { ChevronUp } from '@primeicons/react/chevron-up'
import { Button } from '@primereact/ui/button'
import { DatePicker, type DatePickerRootValueChangeEvent } from '@primereact/ui/datepicker'
import { InputText } from '@primereact/ui/inputtext'
import { fieldDescriptionId } from './field-ids'
import './DatePickerInputs.scss'

/** Month grid with month/year navigation, shared by both pickers. */
function CalendarPanel() {
  return (
    <DatePicker.Calendar>
      <DatePicker.Header>
        <DatePicker.Prev
          as={Button}
          iconOnly
          variant="text"
          rounded
          severity="secondary"
          size="small"
          aria-label="Mes anterior"
        >
          <ChevronLeft />
        </DatePicker.Prev>
        <DatePicker.Title>
          <DatePicker.SelectMonth />
          <DatePicker.SelectYear />
          <DatePicker.Decade />
        </DatePicker.Title>
        <DatePicker.Next
          as={Button}
          iconOnly
          variant="text"
          rounded
          severity="secondary"
          size="small"
          aria-label="Mes siguiente"
        >
          <ChevronRight />
        </DatePicker.Next>
      </DatePicker.Header>
      <DatePicker.Table>
        <DatePicker.TableHead />
        <DatePicker.TableBody />
        <DatePicker.TableBody view="month" />
        <DatePicker.TableBody view="year" />
      </DatePicker.Table>
    </DatePicker.Calendar>
  )
}

function TimeStepper({ type }: { type: 'hour' | 'minute' }) {
  const label = type === 'hour' ? 'hora' : 'minuto'
  return (
    <DatePicker.Picker type={type}>
      <DatePicker.Increment
        as={Button}
        iconOnly
        variant="text"
        rounded
        severity="secondary"
        size="small"
        aria-label={`Aumentar ${label}`}
      >
        <ChevronUp />
      </DatePicker.Increment>
      {type === 'hour' ? <DatePicker.Hour /> : <DatePicker.Minute />}
      <DatePicker.Decrement
        as={Button}
        iconOnly
        variant="text"
        rounded
        severity="secondary"
        size="small"
        aria-label={`Disminuir ${label}`}
      >
        <ChevronDown />
      </DatePicker.Decrement>
    </DatePicker.Picker>
  )
}

type DateTimeInputProps = {
  inputId: string
  value: Date | null
  onChange: (value: Date | null) => void
  onBlur?: () => void
  minDate?: Date
  maxDate?: Date
  invalid?: boolean
}

/** Date and time (24 h) in one field, e.g. when a vehicle entered or left. */
export function DateTimeInput({
  inputId,
  value,
  onChange,
  onBlur,
  minDate,
  maxDate,
  invalid = false,
}: DateTimeInputProps) {
  return (
    <DatePicker.Root
      value={value}
      onValueChange={(event: DatePickerRootValueChangeEvent) =>
        onChange(event.value instanceof Date ? event.value : null)
      }
      onBlur={onBlur}
      showTime
      hourFormat="24"
      minDate={minDate}
      maxDate={maxDate}
      fluid
    >
      <DatePicker.Input
        as={InputText}
        id={inputId}
        // `invalid` goes on the input (InputText styles it); on Root it leaks to the DOM.
        invalid={invalid}
        aria-invalid={invalid}
        aria-describedby={fieldDescriptionId(inputId)}
        placeholder="dd/mm/aaaa hh:mm"
      />
      <DatePicker.Portal>
        <DatePicker.Positioner>
          <DatePicker.Popup>
            <DatePicker.Body>
              <DatePicker.Panel>
                <CalendarPanel />
                <DatePicker.Time className="date-picker-time">
                  <TimeStepper type="hour" />
                  <DatePicker.Separator />
                  <TimeStepper type="minute" />
                </DatePicker.Time>
              </DatePicker.Panel>
            </DatePicker.Body>
          </DatePicker.Popup>
        </DatePicker.Positioner>
      </DatePicker.Portal>
    </DatePicker.Root>
  )
}

export type DateRange = { from: Date | undefined; to: Date | undefined }

type DateRangeInputProps = {
  inputId: string
  value: DateRange
  onChange: (value: DateRange) => void
  maxDate?: Date
  ariaLabel?: string
}

/** Start and end day picked in one calendar (the end can be left empty for a single day). */
export function DateRangeInput({
  inputId,
  value,
  onChange,
  maxDate,
  ariaLabel,
}: DateRangeInputProps) {
  const pickerValue = value.from ? [value.from, value.to ?? null] : null

  return (
    <DatePicker.Root
      value={pickerValue}
      selectionMode="range"
      manualInput={false}
      maxDate={maxDate}
      onValueChange={(event: DatePickerRootValueChangeEvent) => {
        const [from, to] = Array.isArray(event.value) ? event.value : []
        onChange({
          from: from instanceof Date ? from : undefined,
          to: to instanceof Date ? to : undefined,
        })
      }}
      fluid
    >
      <DatePicker.Input
        as={InputText}
        id={inputId}
        aria-label={ariaLabel}
        placeholder="Rango de fechas"
      />
      <DatePicker.Portal>
        <DatePicker.Positioner>
          <DatePicker.Popup>
            <DatePicker.Body>
              <DatePicker.Panel>
                <CalendarPanel />
              </DatePicker.Panel>
            </DatePicker.Body>
            <DatePicker.Buttonbar>
              <DatePicker.Today as={Button} size="small" variant="text">
                Hoy
              </DatePicker.Today>
              <DatePicker.Clear as={Button} size="small" variant="text" severity="secondary">
                Limpiar
              </DatePicker.Clear>
            </DatePicker.Buttonbar>
          </DatePicker.Popup>
        </DatePicker.Positioner>
      </DatePicker.Portal>
    </DatePicker.Root>
  )
}
