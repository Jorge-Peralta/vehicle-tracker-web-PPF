import type { Driver } from '../../api/types'
import { formatIdentityNumber } from '../../lib/formatters'

/** Selector options for drivers; the identity number tells apart drivers with the same name. */
export function toDriverOptions(drivers: Driver[]) {
  return drivers.map((driver) => ({
    value: driver.id,
    label: `${driver.fullName} · ${formatIdentityNumber(driver.identityNumber)}`,
  }))
}
