import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { AppLayout } from '../components/layout/AppLayout'
import { NotFoundPage } from './NotFoundPage'

// Each page is loaded on demand, so the first visit only downloads the page it needs.
const VehiclesListPage = lazy(() =>
  import('../features/vehicles/pages/VehiclesListPage').then((module) => ({
    default: module.VehiclesListPage,
  })),
)
const VehicleFormPage = lazy(() =>
  import('../features/vehicles/pages/VehicleFormPage').then((module) => ({
    default: module.VehicleFormPage,
  })),
)
const MovementsListPage = lazy(() =>
  import('../features/movements/pages/MovementsListPage').then((module) => ({
    default: module.MovementsListPage,
  })),
)
const MovementFormPage = lazy(() =>
  import('../features/movements/pages/MovementFormPage').then((module) => ({
    default: module.MovementFormPage,
  })),
)

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/movements" replace />} />
        <Route path="vehicles" element={<VehiclesListPage />} />
        <Route path="vehicles/new" element={<VehicleFormPage />} />
        <Route path="vehicles/:id/edit" element={<VehicleFormPage />} />
        <Route path="movements" element={<MovementsListPage />} />
        <Route path="movements/new" element={<MovementFormPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
