'use client'

import { Link } from '@tanstack/react-router'
import * as React from 'react'
import {
  CreditCard,
  FileText,
  Home,
  Inbox,
  LayoutDashboard,
  Mail,
  Plane,
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
  ],
  navSecondary: [
    {
      title: 'Public site',
      url: '/',
      icon: Home,
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
              <Link to="/dashboard">
                <Plane className="size-5!" />
                <span className="text-base font-semibold">JustMiles</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} label="Admin" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
