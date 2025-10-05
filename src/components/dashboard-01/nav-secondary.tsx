"use client"

import * as React from "react"
import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HelpCircle, Search, Sun, Moon, Monitor } from "lucide-react"
import { SearchTrigger } from "./search-trigger"
import { CommandShortcut } from "../ui/command"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useTheme } from "next-themes"
import { Skeleton } from "../ui/skeleton"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: Icon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const [open, setOpen] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    setIsMounted(true)
  }, [])


  return (
    <>
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
            <SidebarMenuItem key='search'>
              <SidebarMenuButton asChild onClick={() => setOpen(true)}>
                <a href="#">
                  <Search />
                  <span>Buscar</span>
                  <CommandShortcut>⌘K</CommandShortcut>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem key='help'>
              <SidebarMenuButton asChild>
                <a href="#">
                  <HelpCircle  />
                  <span>Ayuda</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem key='theme'>
              { isMounted && (
                <ToggleGroup 
                  type="single" 
                  value={theme} 
                  onValueChange={(value) => value && setTheme(value)}
                  className="h-10 w-full mt-2 border"
                >
                  <ToggleGroupItem value="light" size="sm" className="h-full bord">
                    <Sun className="h-3 w-3" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="dark" size="sm" className="h-full">
                    <Moon className="h-3 w-3" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="system" size="sm" className="h-full">
                    <Monitor className="h-3 w-3" />
                  </ToggleGroupItem>
                </ToggleGroup>
              )}
              { !isMounted && (
                <Skeleton className="h-10 w-full mt-2" />
              )}
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
    <SearchTrigger open={open} setOpen={setOpen} />
    </>
  )
}
