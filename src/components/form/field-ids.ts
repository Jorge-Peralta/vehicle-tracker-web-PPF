/** Id of a field's hint/error text, for the input's `aria-describedby`. */
export function fieldDescriptionId(inputId: string) {
  return `${inputId}-description`
}

/** Id of a field's label, for controls that can't use `<label htmlFor>` (e.g. Select). */
export function fieldLabelId(inputId: string) {
  return `${inputId}-label`
}
