import { Suspense, lazy } from 'react'

import type { ReactElement } from 'react'
import type { NavGroup, NavItem } from './NavGroupDropdown'

interface LazyMobileMenuProps {
  navItems: NavItem[]
  navGroups: NavGroup[]
}

const MobileMenu = lazy(() => import('./MobileMenu'))

export function LazyMobileMenu({
  navItems,
  navGroups,
}: LazyMobileMenuProps): ReactElement {
  return (
    <Suspense fallback={<MobileMenuFallback />}>
      <MobileMenu navItems={navItems} navGroups={navGroups} />
    </Suspense>
  )
}

function MobileMenuFallback(): ReactElement {
  return (
    <div
      className="h-8 w-8 animate-pulse rounded-full bg-muted lg:hidden"
      aria-hidden="true"
    />
  )
}
