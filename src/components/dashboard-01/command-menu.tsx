"use client"

import { useEffect, useState } from "react"
import { Search, Store, Package, ShoppingCart, Settings, FileText, Bot } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useRouter } from "next/navigation"

interface CommandMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter()
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        console.log("k")
        e.preventDefault()
        if (!open) {
          onOpenChange(true)
        } else {
          onOpenChange(false)
        }
      }

      if(e.key === "p" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        router.push("/panel/tienda")
        onOpenChange(false)

      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, onOpenChange])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar en todo el panel..." />
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
        
        {/* Sugerencias */}
        <CommandGroup heading="Sugerencias">
          <CommandItem>
            <Package className="mr-2 h-4 w-4" />
            <span>Chaqueta Punto Cremallera</span>
          </CommandItem>
          <CommandItem>
            <Package className="mr-2 h-4 w-4" />
            <span>Cazadora Piel Limited Edition</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Páginas Rápidas */}
        <CommandGroup heading="Tienda">
          <CommandItem>
            <Store className="mr-2 h-4 w-4" />
            <span>Pedidos</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Package className="mr-2 h-4 w-4" />
            <span>Escaparate</span>
            <CommandShortcut>⌘E</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Carrito</span>
            <CommandShortcut>⌘O</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración de tienda</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Documentación */}
        <CommandGroup heading="Flujos">
          <CommandItem>
            <Bot className="mr-2 h-4 w-4" />
            <span>Iniciar</span>
          </CommandItem>
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Trigger</span>
          </CommandItem>
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Configuración</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Integraciones">
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Añadir una integración</span>
          </CommandItem>
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Guía de inicio</span>
          </CommandItem>
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Integracion WhatsApp</span>
          </CommandItem>
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Integracion Facebook</span>
          </CommandItem>
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Integracion Instagram</span>
          </CommandItem>
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Integracion Telegram</span>
          </CommandItem>
          
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Integracion SMS</span>
          </CommandItem>
          
          
          
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
