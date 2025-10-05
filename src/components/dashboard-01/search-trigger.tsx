"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { CommandMenu } from "./command-menu"

export function SearchTrigger({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  return (
    <>
      <CommandMenu open={open} onOpenChange={setOpen} />
    </>
  )
}
