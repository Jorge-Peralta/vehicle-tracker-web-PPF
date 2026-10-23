/** "HAA1234" -> "HAA 1234", easier to read than the stored form. */
export function formatPlate(plate: string): string {
  return plate.replace(/^([A-Z]{3})(\d{4})$/, '$1 $2')
}

const integerFormatter = new Intl.NumberFormat('es-HN', { maximumFractionDigits: 0 })

/** 15230 -> "15,230 km" */
export function formatMileage(mileage: number): string {
  return `${integerFormatter.format(mileage)} km`
}
