import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky left-0 right-0 z-50 -mb-16 px-6 transition-all duration-300 bg-background/50 backdrop-blur-sm border border-border top-4 max-w-3xl mx-auto px-4 py-2 sm:px-4 rounded-xl">
    <div className="flex flex-row items-center justify-between ">
      <div className="flex flex-row items-center justify-center gap-1">
        <Link href="/">
          <h1 className="text-xl font-bold text-gray-900">
            <span className="text-blue-600">Botivent</span>
          </h1>
        </Link>
      </div>
      <div className="relative hidden md:block">
        <ul className="relative flex flex-row items-center justify-center gap-6">
          <li>
            <Link
              href="#features"
              className="text-foreground hover:text-foreground/70 text-sm font-medium transition-colors"
            >
              Características
            </Link>
          </li>
          <li>
            <Link
              href="#pricing"
              className="text-foreground hover:text-foreground/70 text-sm font-medium transition-colors"
            >
              Precios
            </Link>
          </li>
          <li>
            <Link
              href="#faq"
              className="text-foreground hover:text-foreground/70 text-sm font-medium transition-colors"
            >
              FAQ
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex flex-row items-center justify-center gap-4">
        <Link href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/auth`}>
          <Button variant="outline" className="btn-text-primary bg-white/30">
            Iniciar Sesión
          </Button>
        </Link>
        <Link href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/auth?action=start`}>
          <Button className="btn-cta-primary">Comenzar</Button>
        </Link>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>

    {/* Mobile Menu */}
    {isMenuOpen && (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 md:hidden">
        <div className="px-4 py-3 space-y-2">
          <a
            href="#features"
            className="text-gray-600 hover:text-gray-900 block py-2 text-sm font-medium"
          >
            Características
          </a>
          <a
            href="#pricing"
            className="text-gray-600 hover:text-gray-900 block py-2 text-sm font-medium"
          >
            Precios
          </a>
          <div className="pt-2 border-t border-gray-100">
            <Link href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/auth`}>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-900"
              >
                Iniciar Sesión
              </Button>
            </Link>
            <Link href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/auth?action=start`}>
              <Button className="w-full mt-2 btn-cta-primary">Comenzar</Button>
            </Link>
          </div>
        </div>
      </div>
    )}
  </nav>

  )
}