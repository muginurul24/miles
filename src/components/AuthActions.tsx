import { Link, useNavigate } from '@tanstack/react-router'
import {
  Crown,
  LayoutDashboard,
  Loader2,
  LogIn,
  LogOut,
  UserPlus,
} from 'lucide-react'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Button, buttonVariants } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { SheetClose } from '#/components/ui/sheet'
import { authClient } from '#/lib/auth-client'
import { cn } from '#/lib/utils'

type AuthActionsVariant = 'desktop' | 'mobile'

interface AuthActionsProps {
  variant: AuthActionsVariant
}

interface SessionUser {
  name?: string | null
  email: string
  image?: string | null
  role?: string | null
}

function getDisplayName(user: SessionUser): string {
  return user.name?.trim() || user.email
}

function getInitials(user: SessionUser): string {
  const displayName = getDisplayName(user)
  const parts = displayName.split(/\s+/).filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase()
  }

  return displayName.slice(0, 2).toUpperCase()
}

function getUserRole(user: SessionUser): string | null {
  return typeof user.role === 'string' ? user.role : null
}

function UserAvatar({
  user,
  size = 'sm',
}: {
  user: SessionUser
  size?: 'sm' | 'default'
}) {
  const displayName = getDisplayName(user)

  return (
    <Avatar size={size}>
      <AvatarImage src={user.image ?? undefined} alt={displayName} />
      <AvatarFallback>{getInitials(user)}</AvatarFallback>
    </Avatar>
  )
}

function LoggedOutActions({ variant }: AuthActionsProps) {
  if (variant === 'mobile') {
    return (
      <div className="grid grid-cols-2 gap-2">
        <SheetClose asChild>
          <Link
            to="/auth/login"
            className={buttonVariants({
              variant: 'outline',
              className: 'no-underline',
            })}
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Masuk
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            to="/auth/register"
            className={buttonVariants({ className: 'no-underline' })}
          >
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Daftar
          </Link>
        </SheetClose>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/auth/login" className="gap-2 no-underline">
          <LogIn className="h-4 w-4" aria-hidden="true" />
          Masuk
        </Link>
      </Button>
      <Button size="sm" asChild>
        <Link to="/auth/register" className="gap-2 no-underline">
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Daftar
        </Link>
      </Button>
    </div>
  )
}

export function AuthActions({ variant }: AuthActionsProps) {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut(): Promise<void> {
    setIsSigningOut(true)

    try {
      await authClient.signOut()
      await navigate({ to: '/' })
    } finally {
      setIsSigningOut(false)
    }
  }

  if (isPending) {
    return (
      <div
        className={cn(
          'animate-pulse rounded-md bg-muted',
          variant === 'mobile' ? 'h-20 w-full' : 'h-8 w-28',
        )}
        aria-hidden="true"
      />
    )
  }

  if (!session) {
    return <LoggedOutActions variant={variant} />
  }

  const user = session.user
  const displayName = getDisplayName(user)
  const isAdmin = getUserRole(user) === 'admin'

  if (variant === 'mobile') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
          <UserAvatar user={user} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {displayName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <div className="grid gap-2">
          {isAdmin ? (
            <SheetClose asChild>
              <Link
                to="/dashboard"
                className={buttonVariants({
                  variant: 'outline',
                  className: 'justify-start no-underline',
                })}
              >
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                Dashboard
              </Link>
            </SheetClose>
          ) : (
            <SheetClose asChild>
              <Link
                to="/membership"
                className={buttonVariants({
                  variant: 'outline',
                  className: 'justify-start no-underline',
                })}
              >
                <Crown className="h-4 w-4" aria-hidden="true" />
                Membership
              </Link>
            </SheetClose>
          )}
          <SheetClose asChild>
            <Button
              type="button"
              variant="destructive"
              className="justify-start"
              disabled={isSigningOut}
              onClick={() => void handleSignOut()}
            >
              {isSigningOut ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <LogOut className="h-4 w-4" aria-hidden="true" />
              )}
              Logout
            </Button>
          </SheetClose>
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 px-2">
          <UserAvatar user={user} />
          <span className="max-w-28 truncate">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3">
            <UserAvatar user={user} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {displayName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {isAdmin ? (
            <DropdownMenuItem asChild>
              <Link to="/dashboard">
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                Dashboard
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild>
              <Link to="/membership">
                <Crown className="h-4 w-4" aria-hidden="true" />
                Membership
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={isSigningOut}
          onSelect={(event) => {
            event.preventDefault()
            void handleSignOut()
          }}
        >
          {isSigningOut ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <LogOut className="h-4 w-4" aria-hidden="true" />
          )}
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
