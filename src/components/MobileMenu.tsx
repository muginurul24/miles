import { Link } from '@tanstack/react-router'
import { Menu, Plane } from 'lucide-react'
import { AuthActions } from './AuthActions'
import ThemeToggle from './ThemeToggle'
import { Button } from '#/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'
import { Separator } from '#/components/ui/separator'
import { cn } from '#/lib/utils'

import type { NavGroup, NavItem } from './NavGroupDropdown'

interface MobileMenuProps {
  navItems: NavItem[]
  navGroups: NavGroup[]
}

function MobileNavLink({
  item,
  compact = false,
}: {
  item: NavItem
  compact?: boolean
}) {
  return (
    <SheetClose asChild>
      <Link
        to={item.href}
        className={cn(
          'block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground no-underline transition-colors hover:bg-secondary hover:text-foreground',
          item.highlighted && 'font-semibold text-accent hover:text-accent',
          compact && 'py-2 text-xs',
        )}
      >
        {item.label}
      </Link>
    </SheetClose>
  )
}

export default function MobileMenu({ navItems, navGroups }: MobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="rounded-full bg-card lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[min(22rem,calc(100vw-2rem))] overflow-y-auto p-0">
        <SheetHeader className="border-b border-border p-5">
          <SheetTitle className="flex items-center gap-2 font-display text-xl">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Plane className="h-4 w-4" aria-hidden="true" />
            </span>
            JustMiles
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Theme
            </span>
            <ThemeToggle />
          </div>

          <AuthActions variant="mobile" />

          <nav className="flex flex-col gap-1">
            <SheetClose asChild>
              <Link
                to="/"
                className="block rounded-md px-3 py-2.5 text-sm font-semibold text-primary no-underline transition-colors hover:bg-secondary"
              >
                Home
              </Link>
            </SheetClose>
            {navItems.map((item) => (
              <MobileNavLink key={item.label} item={item} />
            ))}
          </nav>

          <Separator />

          <div className="space-y-4">
            {navGroups.map((group) => (
              <div key={group.title}>
                <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.title}
                </h3>
                <div className="mt-1">
                  {group.items.map((item) => (
                    <MobileNavLink
                      key={`${group.title}-${item.label}`}
                      item={item}
                      compact
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
