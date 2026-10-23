import { Navigate, Route, Routes } from 'react-router'
import { AppLayout } from '../components/layout/AppLayout'
import { MovementFormPage } from '../features/movements/pages/MovementFormPage'
import { MovementsListPage } from '../features/movements/pages/MovementsListPage'
import { VehicleFormPage } from '../features/vehicles/pages/VehicleFormPage'
import { VehiclesListPage } from '../features/vehicles/pages/VehiclesListPage'
import { NotFoundPage } from './NotFoundPage'

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
