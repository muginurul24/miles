import { Link } from '@tanstack/react-router'
import { Plane } from 'lucide-react'
import { AuthActions } from './AuthActions'
import MobileMenu from './MobileMenu'
import { NavGroupDropdown } from './NavGroupDropdown'
import ThemeToggle from './ThemeToggle'
import { cn } from '#/lib/utils'

import type { NavGroup, NavItem } from './NavGroupDropdown'

const mainNavItems: NavItem[] = [
  { label: 'Credit Cards', href: '/credit-cards' },
  { label: 'Calculator', href: '/calculator', highlighted: true },
  { label: 'Compare', href: '/compare' },
]

const navGroups: NavGroup[] = [
  {
    title: 'Reviews',
    items: [
      { label: 'Flight Reviews', href: '/reviews/flight' },
      { label: 'Hotel Reviews', href: '/reviews/hotel' },
      { label: 'Lounge Reviews', href: '/reviews/lounge' },
    ],
  },
  {
    title: 'Konten',
    items: [
      { label: 'News', href: '/news' },
      { label: 'Guides', href: '/guides' },
      { label: 'Deals', href: '/deals' },
    ],
  },
  {
    title: 'Layanan',
    items: [
      { label: 'Membership', href: '/membership' },
      { label: 'Consulting', href: '/consulting' },
    ],
  },
]

function NavAnchor({ item }: { item: NavItem }) {
  return (
    <Link
      to={item.href}
      className={cn(
        'text-sm font-medium text-muted-foreground no-underline transition-colors hover:text-accent',
        item.highlighted && 'font-semibold text-accent hover:text-accent-hover',
      )}
    >
      {item.label}
    </Link>
  )
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 px-4 backdrop-blur-lg">
      <nav className="page-wrap flex h-16 items-center justify-between gap-4 lg:h-20">
        <h2 className="m-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary no-underline"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Plane className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="font-display text-xl font-bold tracking-normal">
              JustMiles
            </span>
          </Link>
        </h2>

        <div className="hidden items-center gap-7 lg:flex">
          {mainNavItems.map((item) => (
            <NavAnchor key={item.label} item={item} />
          ))}
          {navGroups.map((group) => (
            <NavGroupDropdown key={group.title} group={group} />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <AuthActions variant="desktop" />
          </div>
          <MobileMenu navItems={mainNavItems} navGroups={navGroups} />
        </div>
      </nav>
    </header>
  )
}
