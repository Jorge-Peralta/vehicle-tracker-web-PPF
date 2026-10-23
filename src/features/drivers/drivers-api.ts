import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../api/client'
import type { Driver } from '../../api/types'

export const driverKeys = {
  all: ['drivers'] as const,
  list: (search: string) => [...driverKeys.all, 'list', search] as const,
}

export async function fetchDrivers(search = ''): Promise<Driver[]> {
  const { data } = await apiClient.get<Driver[]>('/drivers', {
    params: search ? { search } : undefined,
  })
  return data
}

/** Drivers matching `search` (all of them when empty), for selectors and suggestions. */
export function useDrivers(search = '') {
  return useQuery({
    queryKey: driverKeys.list(search),
    queryFn: () => fetchDrivers(search),
  })
}
