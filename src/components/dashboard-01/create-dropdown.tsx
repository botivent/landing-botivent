"use client"

import { Plus, Package, Link, Workflow, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function CreateDropdown() {
  const router = useRouter()

  const createOptions = [
    {
      label: "Crear Producto",
      icon: Package,
      href: "/panel/tienda/productos/nuevo",
    },
    {
      label: "Crear Link de Pago",
      icon: Link,
      href: "/panel/tienda/enlaces-de-pago/nuevo",
    },
    {
      label: "Crear Flujo",
      icon: Workflow,
      href: "/panel/bot/flujos/nuevo",
    },
    {
      label: "Crear Integración",
      icon: Key,
      href: "/panel/bot/integraciones/nuevo",
    },
  ]

  const handleCreate = (href: string) => {
    router.push(href)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Crear
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {createOptions.map((option) => {
          const Icon = option.icon
          return (
            <DropdownMenuItem
              key={option.href}
              onClick={() => handleCreate(option.href)}
              className="cursor-pointer"
            >
              <Icon className="mr-2 h-4 w-4" />
              {option.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
