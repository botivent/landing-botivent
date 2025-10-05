"use client"

import Link from "next/link"
import ToggleDarkMode from "@/components/ui/toggle-dark-mode"

export default function Footer() {
  return (
    <footer className="w-full border-t py-6 mt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Botivent. Todos los derechos reservados.
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/pages/privacy" className="hover:underline">Privacidad</Link>
          <Link href="/pages/terms" className="hover:underline">Términos</Link>
          <Link href="/pages/delete-data" className="hover:underline">Eliminar datos</Link>
        </nav>
        <ToggleDarkMode />
      </div>
    </footer>
  )
}


