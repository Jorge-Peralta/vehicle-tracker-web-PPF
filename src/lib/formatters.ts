/** "HAA1234" -> "HAA 1234", easier to read than the stored form. */
export function formatPlate(plate: string): string {
  return plate.replace(/^([A-Z]{3})(\d{4})$/, '$1 $2')
}

/** Honduran "Número de Identidad": "0801199012345" -> "0801-1990-12345". */
export function formatIdentityNumber(identityNumber: string): string {
  return identityNumber.replace(/^(\d{4})(\d{4})(\d{5})$/, '$1-$2-$3')
}

const integerFormatter = new Intl.NumberFormat('es-HN', { maximumFractionDigits: 0 })

/** 15230 -> "15,230 km" */
export function formatMileage(mileage: number): string {
  return `${integerFormatter.format(mileage)} km`
}
