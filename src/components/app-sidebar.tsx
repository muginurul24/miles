'use client'

import * as React from 'react'
import {
  BarChart3,
  CircleHelp,
  CreditCard,
  FileText,
  Inbox,
  LayoutDashboard,
  Mail,
  Plane,
  Settings,
  Users,
} from 'lucide-react'

import { NavMain } from '#/components/nav-main.tsx'
import { NavSecondary } from '#/components/nav-secondary.tsx'
import { NavUser } from '#/components/nav-user.tsx'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '#/components/ui/sidebar.tsx'

const data = {
  user: {
    name: 'JustMiles Admin',
    email: 'admin@justmiles.id',
    avatar: '',
  },
  navMain: [
    {
      title: 'Overview',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Cards',
      url: '/dashboard/cards',
      icon: CreditCard,
    },
    {
      title: 'Articles',
      url: '/dashboard/articles',
      icon: FileText,
    },
    {
      title: 'Inquiries',
      url: '/dashboard/inquiries',
      icon: Inbox,
    },
    {
      title: 'Subscribers',
      url: '/dashboard/subscribers',
      icon: Mail,
    },
    {
      title: 'Charts',
      url: '/dashboard/charts',
      icon: BarChart3,
    },
  ],
  navSecondary: [
    {
      title: 'Members',
      url: '/dashboard/members',
      icon: Users,
    },
    {
      title: 'Settings',
      url: '/dashboard/settings',
      icon: Settings,
    },
    {
      title: 'Public site',
      url: '/',
      icon: CircleHelp,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <Plane className="size-5!" />
                <span className="text-base font-semibold">JustMiles</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} label="Admin" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
