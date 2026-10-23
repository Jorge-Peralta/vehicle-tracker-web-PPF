import { apiClient } from '../../../api/client'
import type {
  DeleteVehicleResult,
  ListVehiclesParams,
  Vehicle,
  VehicleDetail,
  VehicleInput,
} from '../../../api/types'

export async function fetchVehicles(params: ListVehiclesParams = {}): Promise<Vehicle[]> {
  const { data } = await apiClient.get<Vehicle[]>('/vehicles', { params })
  return data
}

export async function fetchVehicle(id: number): Promise<VehicleDetail> {
  const { data } = await apiClient.get<VehicleDetail>(`/vehicles/${id}`)
  return data
}

export async function createVehicle(input: VehicleInput): Promise<Vehicle> {
  const { data } = await apiClient.post<Vehicle>('/vehicles', input)
  return data
}

export async function updateVehicle(id: number, input: VehicleInput): Promise<Vehicle> {
  const { data } = await apiClient.put<Vehicle>(`/vehicles/${id}`, input)
  return data
}

export async function deleteVehicle(id: number): Promise<DeleteVehicleResult> {
  const { data } = await apiClient.delete<DeleteVehicleResult>(`/vehicles/${id}`)
  return data
}
