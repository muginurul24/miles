import { Link } from '@tanstack/react-router'
import { ChevronDown, Plane } from 'lucide-react'
import { AuthActions } from './AuthActions'
import MobileMenu from './MobileMenu'
import ThemeToggle from './ThemeToggle'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { cn } from '#/lib/utils'

export interface NavItem {
  label: string
  href: string
  highlighted?: boolean
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

const mainNavItems: NavItem[] = [
  { label: 'News', href: '/news' },
  { label: 'Credit Cards', href: '/credit-cards' },
  { label: 'Calculator', href: '/calculator', highlighted: true },
  { label: 'Compare', href: '/compare' },
  { label: 'Guides', href: '/guides' },
  { label: 'Deals', href: '/deals' },
  { label: 'Membership', href: '/membership' },
  { label: 'Consulting', href: '/consulting' },
]

const reviewGroups: NavGroup[] = [
  {
    title: 'Reviews',
    items: [
      { label: 'Flight Reviews', href: '/reviews/flight' },
      { label: 'Hotel Reviews', href: '/reviews/hotel' },
      { label: 'Lounge Reviews', href: '/reviews/lounge' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { label: 'Semua Guides', href: '/guides' },
      { label: 'Guide Pemula', href: '/guides' },
      { label: 'Redemption Guide', href: '/guides' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { label: 'Miles Calculator', href: '/calculator' },
      { label: 'Compare Cards', href: '/compare' },
    ],
  },
]

function NavAnchor({ item }: { item: NavItem }) {
  return (
    <a
      href={item.href}
      className={cn(
        'text-sm font-medium text-muted-foreground no-underline transition-colors hover:text-accent',
        item.highlighted && 'font-semibold text-accent hover:text-accent-hover',
      )}
    >
      {item.label}
    </a>
  )
}

function ReviewsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 px-0 text-sm font-medium text-muted-foreground hover:bg-transparent hover:text-accent"
        >
          Reviews
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-72 p-2">
        {reviewGroups.map((group, index) => (
          <DropdownMenuGroup key={group.title}>
            {index > 0 ? <DropdownMenuSeparator /> : null}
            <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
              {group.title}
            </DropdownMenuLabel>
            {group.items.map((item) => (
              <DropdownMenuItem key={`${group.title}-${item.label}`} asChild>
                <a href={item.href}>{item.label}</a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
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
          {mainNavItems.slice(0, 4).map((item) => (
            <NavAnchor key={item.label} item={item} />
          ))}
          <ReviewsDropdown />
          {mainNavItems.slice(4).map((item) => (
            <NavAnchor key={item.label} item={item} />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <AuthActions variant="desktop" />
          </div>
          <MobileMenu navItems={mainNavItems} reviewGroups={reviewGroups} />
        </div>
      </nav>
    </header>
  )
}
