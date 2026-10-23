/**
 * Friendly names for the API types generated from its OpenAPI spec (`npm run api:types`).
 * Regenerate `schema.d.ts` whenever the API contract changes.
 */
import type { components, paths } from './schema'

type Schemas = components['schemas']
type JsonBody<T> = T extends { content: { 'application/json': infer Body } } ? Body : never

export type Vehicle = Schemas['Vehicle']
export type VehicleDetail = Schemas['VehicleDetail']
export type Driver = Schemas['Driver']
export type Movement = Schemas['Movement']
export type MovementPage = Schemas['MovementPage']
export type MovementType = Movement['type']
export type DeleteVehicleResult = Schemas['DeleteVehicleResult']

export type VehicleInput = JsonBody<paths['/api/vehicles']['post']['requestBody']>
export type RegisterMovementInput = JsonBody<paths['/api/movements']['post']['requestBody']>

export type ListVehiclesParams = NonNullable<paths['/api/vehicles']['get']['parameters']['query']>
export type ListMovementsParams = NonNullable<paths['/api/movements']['get']['parameters']['query']>
