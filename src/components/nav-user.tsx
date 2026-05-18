'use client'

import { useNavigate } from '@tanstack/react-router'
import { Loader2, LogOut, MoreVertical } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu.tsx'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '#/components/ui/sidebar.tsx'
import { authClient } from '#/lib/auth-client.ts'

interface SessionUser {
  name?: string | null
  email: string
  image?: string | null
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

function UserAvatar({
  user,
  muted = false,
}: {
  user: SessionUser
  muted?: boolean
}) {
  const displayName = getDisplayName(user)

  return (
    <Avatar className="h-8 w-8 rounded-lg">
      <AvatarImage src={user.image ?? undefined} alt={displayName} />
      <AvatarFallback className="rounded-lg">
        {muted ? '...' : getInitials(user)}
      </AvatarFallback>
    </Avatar>
  )
}

export function NavUser() {
  const { isMobile } = useSidebar()
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
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            disabled
            aria-label="Memuat profil admin"
          >
            <UserAvatar
              user={{ name: 'Memuat profil admin', email: 'loading' }}
              muted
            />
            <div className="grid flex-1 gap-1 text-left">
              <span className="h-3 w-24 animate-pulse rounded bg-sidebar-accent" />
              <span className="h-2.5 w-32 animate-pulse rounded bg-sidebar-accent" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (!session) {
    return null
  }

  const user = session.user
  const displayName = getDisplayName(user)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar user={user} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <MoreVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar user={user} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
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
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <LogOut aria-hidden="true" />
              )}
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
