import { Link } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'

export interface NavItem {
  label: string
  href: string
  highlighted?: boolean
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

interface NavGroupDropdownProps {
  group: NavGroup
}

export function NavGroupDropdown({
  group,
}: NavGroupDropdownProps): React.ReactElement {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 px-0 text-sm font-medium text-muted-foreground hover:bg-transparent hover:text-accent"
        >
          {group.title}
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56 p-2">
        <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
          {group.title}
        </DropdownMenuLabel>
        {group.items.map((item) => (
          <DropdownMenuItem key={`${group.title}-${item.label}`} asChild>
            <Link to={item.href} className="cursor-pointer no-underline">
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
