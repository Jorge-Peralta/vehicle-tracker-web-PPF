import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ListVehiclesParams, VehicleInput } from '../../../api/types'
import {
  createVehicle,
  deleteVehicle,
  fetchVehicle,
  fetchVehicles,
  updateVehicle,
} from '../api/vehicles-api'

/** Query keys for vehicles; invalidating `vehicleKeys.all` refreshes every vehicle query. */
export const vehicleKeys = {
  all: ['vehicles'] as const,
  list: (params: ListVehiclesParams) => [...vehicleKeys.all, 'list', params] as const,
  detail: (id: number) => [...vehicleKeys.all, 'detail', id] as const,
}

export function useVehicles(params: ListVehiclesParams = {}) {
  return useQuery({
    queryKey: vehicleKeys.list(params),
    queryFn: () => fetchVehicles(params),
    // Keep showing the previous results while a new search loads, instead of flashing empty.
    placeholderData: keepPreviousData,
  })
}

export function useVehicle(id: number | undefined) {
  return useQuery({
    queryKey: vehicleKeys.detail(id ?? 0),
    queryFn: () => fetchVehicle(id!),
    enabled: id !== undefined,
  })
}

/**
 * Any vehicle change also affects the movements list, which shows each movement's
 * plate, brand, and model.
 */
function useInvalidateVehicleData() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all }),
      queryClient.invalidateQueries({ queryKey: ['movements'] }),
    ])
}

export function useCreateVehicle() {
  const invalidate = useInvalidateVehicleData()
  return useMutation({
    mutationFn: (input: VehicleInput) => createVehicle(input),
    onSuccess: invalidate,
  })
}

export function useUpdateVehicle(id: number) {
  const invalidate = useInvalidateVehicleData()
  return useMutation({
    mutationFn: (input: VehicleInput) => updateVehicle(id, input),
    onSuccess: invalidate,
  })
}

export function useDeleteVehicle() {
  const invalidate = useInvalidateVehicleData()
  return useMutation({
    mutationFn: (id: number) => deleteVehicle(id),
    onSuccess: invalidate,
  })
}
