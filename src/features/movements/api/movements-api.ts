import { apiClient } from '../../../api/client'
import type {
  DailyMovementSummary,
  DailySummaryParams,
  ListMovementsParams,
  Movement,
  MovementPage,
  RegisterMovementInput,
} from '../../../api/types'

export async function fetchMovements(params: ListMovementsParams): Promise<MovementPage> {
  const { data } = await apiClient.get<MovementPage>('/movements', { params })
  return data
}

export async function fetchDailySummary(
  params: DailySummaryParams,
): Promise<DailyMovementSummary[]> {
  const { data } = await apiClient.get<DailyMovementSummary[]>('/movements/daily-summary', {
    params,
  })
  return data
}

export async function registerMovement(input: RegisterMovementInput): Promise<Movement> {
  const { data } = await apiClient.post<Movement>('/movements', input)
  return data
}
