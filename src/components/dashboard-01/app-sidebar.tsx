"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconPlus,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconBrandGoogle,
  IconTransformPointBottomLeft,
  IconLink,
  IconBasketDollar,
  IconWorld,
  IconKey
} from "@tabler/icons-react"
import { NavStore } from "@/components/dashboard-01/nav-store"
import { NavMain } from "@/components/dashboard-01/nav-main"
import { NavSecondary } from "@/components/dashboard-01/nav-secondary"
import { NavUser } from "@/components/dashboard-01/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useState } from "react"

const data = {
  navMain: [
    {
      title: "Panel",
      url: "/panel",
      icon: IconDashboard,
    },
    {
      title: "Estadisticas",
      url: "#",
      icon: IconChartBar,
    }
  ],
  navSecondary: [
    {
      title: "Ayuda",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Buscar",
      url: "#",
      icon: IconSearch,
    },
  ],
  store: [
    {
      name: "Productos",
      url: "/panel/tienda/productos",
      icon: IconDatabase,
    },
    {
      name: "Enlaces de pago",
      url: "/panel/tienda/enlaces-de-pago",
      icon: IconLink,
    },
    {
      name: "Pedidos",
      url: "/panel/tienda/pedidos",
      icon: IconBasketDollar,
    },
    {
      name: "Escaparate",
      url: "/panel/tienda/escaparate",
      icon: IconWorld,
    }
  ],
  bot: [
    {
      name: "Flujos",
      url: "/panel/bot/flujos",
      icon: IconTransformPointBottomLeft,
    },
    {
      name: "Integraciones",
      url: "/panel/bot/integraciones",
      icon: IconKey,
    }
  ]
}

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user: any }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <span className="text-base font-semibold">Botivent</span>
              </a>
            </SidebarMenuButton>
            
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavStore items={data.bot} title="Bot" />
        <NavStore items={data.store} title="Tienda" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
