import { LogIn, Menu, Plane, UserPlus } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { Button, buttonVariants } from '#/components/ui/button'
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

import type { NavGroup, NavItem } from './Header'

interface MobileMenuProps {
  navItems: NavItem[]
  reviewGroups: NavGroup[]
  authItems: NavItem[]
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
      <a
        href={item.href}
        className={cn(
          'block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground no-underline transition-colors hover:bg-secondary hover:text-foreground',
          item.highlighted && 'font-semibold text-accent hover:text-accent',
          compact && 'py-2 text-xs',
        )}
      >
        {item.label}
      </a>
    </SheetClose>
  )
}

export default function MobileMenu({
  navItems,
  reviewGroups,
  authItems,
}: MobileMenuProps) {
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

          <div className="grid grid-cols-2 gap-2">
            <SheetClose asChild>
              <a
                href={authItems[0]?.href ?? '/auth/login'}
                className={buttonVariants({
                  variant: 'outline',
                  className: 'no-underline',
                })}
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                {authItems[0]?.label ?? 'Masuk'}
              </a>
            </SheetClose>
            <SheetClose asChild>
              <a
                href={authItems[1]?.href ?? '/auth/register'}
                className={buttonVariants({ className: 'no-underline' })}
              >
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                {authItems[1]?.label ?? 'Daftar'}
              </a>
            </SheetClose>
          </div>

          <nav className="flex flex-col gap-1">
            <SheetClose asChild>
              <a
                href="/"
                className="block rounded-md px-3 py-2.5 text-sm font-semibold text-primary no-underline transition-colors hover:bg-secondary"
              >
                Home
              </a>
            </SheetClose>
            {navItems.map((item) => (
              <MobileNavLink key={item.label} item={item} />
            ))}
          </nav>

          <Separator />

          <div className="space-y-4">
            {reviewGroups.map((group) => (
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
