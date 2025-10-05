"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { SearchTrigger } from "./search-trigger"
import { useState } from "react"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4"
        />
        <Breadcrumbs />
        <div className="ml-auto flex items-center gap-2">
          <SearchTrigger open={open} setOpen={setOpen} />
        </div>
      </div>
    </header>
  )
}
