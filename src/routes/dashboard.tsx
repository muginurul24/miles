import { Outlet, createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '#/lib/auth-guards'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: requireAdmin,
  component: DashboardLayoutRoute,
})

function DashboardLayoutRoute() {
  return <Outlet />
}
