import { Link } from '@tanstack/react-router'
import { Plane } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 px-4 backdrop-blur-lg">
      <nav className="page-wrap flex items-center justify-between gap-4 py-3 sm:py-4">
        <h2 className="m-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md text-sm font-semibold text-primary no-underline"
          >
            <Plane className="h-4 w-4 text-accent" />
            JustMiles
          </Link>
        </h2>
        <ThemeToggle />
      </nav>
    </header>
  )
}
