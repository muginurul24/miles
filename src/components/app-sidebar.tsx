'use client'

import * as React from 'react'
import {
  Bot,
  Camera,
  ChartBar,
  CircleHelp,
  ClipboardList,
  Database,
  FileText,
  FileType,
  Folder,
  LayoutDashboard,
  ListChecks,
  Plane,
  Search,
  Settings,
  Users,
} from 'lucide-react'

import { NavDocuments } from '#/components/nav-documents.tsx'
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
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: LayoutDashboard,
    },
    {
      title: 'Lifecycle',
      url: '#',
      icon: ListChecks,
    },
    {
      title: 'Analytics',
      url: '#',
      icon: ChartBar,
    },
    {
      title: 'Projects',
      url: '#',
      icon: Folder,
    },
    {
      title: 'Team',
      url: '#',
      icon: Users,
    },
  ],
  navClouds: [
    {
      title: 'Capture',
      icon: Camera,
      isActive: true,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Proposal',
      icon: FileText,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Prompts',
      icon: Bot,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: Settings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: CircleHelp,
    },
    {
      title: 'Search',
      url: '#',
      icon: Search,
    },
  ],
  documents: [
    {
      name: 'Data Library',
      url: '#',
      icon: Database,
    },
    {
      name: 'Reports',
      url: '#',
      icon: ClipboardList,
    },
    {
      name: 'Word Assistant',
      url: '#',
      icon: FileType,
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
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
