import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ListMovementsParams, RegisterMovementInput } from '../../../api/types'
import { driverKeys } from '../../drivers/drivers-api'
import { vehicleKeys } from '../../vehicles/hooks/use-vehicles'
import { fetchMovements, registerMovement } from '../api/movements-api'

export const movementKeys = {
  all: ['movements'] as const,
  list: (params: ListMovementsParams) => [...movementKeys.all, 'list', params] as const,
}

export function useMovements(params: ListMovementsParams) {
  return useQuery({
    queryKey: movementKeys.list(params),
    queryFn: () => fetchMovements(params),
    // Keep the current page visible while the next one loads.
    placeholderData: keepPreviousData,
  })
}

/**
 * A new movement changes the list, the vehicle's status/last mileage, and possibly
 * adds a driver, so all three are refreshed.
 */
export function useRegisterMovement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: RegisterMovementInput) => registerMovement(input),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: movementKeys.all }),
        queryClient.invalidateQueries({ queryKey: vehicleKeys.all }),
        queryClient.invalidateQueries({ queryKey: driverKeys.all }),
      ]),
  })
}
