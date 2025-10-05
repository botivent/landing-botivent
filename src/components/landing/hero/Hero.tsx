'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { MessageCircle, CreditCard, Zap, Gauge, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Hero({ctaFunction}: {ctaFunction: () => void}) {
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const subRef = useRef<HTMLParagraphElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animación de entrada
      gsap.from(titleRef.current, { y: 16, autoAlpha: 0, duration: 0.55, ease: 'power2.out' })
      gsap.from('.sticker', {
        y: 18,
        autoAlpha: 0,
        rotate: (i: number) => (i % 2 ? 8 : -8),
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.06,
        delay: 0.05,
      })
      gsap.from(subRef.current, { y: 12, autoAlpha: 0, duration: 0.45, ease: 'power2.out', delay: 0.15 })
      gsap.fromTo(
        btnRef.current,
        { y: 10, scale: 0.8, opacity: 0, autoAlpha: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          autoAlpha: 1,
          duration: 0.2,
          ease: 'power2',
          delay: 0.1,
          clearProps: 'opacity,visibility,transform',
        },
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-background" id="hero">
      {/* Base blanco */}

      {/* Burbujas azules (un poco más visibles) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-8 left-1/4 h-36 w-36 rounded-full bg-[radial-gradient(circle,_theme(colors.sky.400/26),_transparent_60%)] blur-2xl" />
        <div className="absolute top-1/3 -right-10 h-28 w-28 rounded-full bg-[radial-gradient(circle,_theme(colors.indigo.400/24),_transparent_60%)] blur-2xl" />
        <div className="absolute bottom-8 left-10 h-24 w-24 rounded-full bg-[radial-gradient(circle,_theme(colors.blue.500/20),_transparent_65%)] blur-xl" />
        <div className="absolute bottom-24 right-1/4 h-20 w-20 rounded-full bg-[radial-gradient(circle,_theme(colors.cyan.400/20),_transparent_60%)] blur-xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 pt-28 md:pt-40 pb-12 md:pb-20 text-center">
        {/* Título más grande + “stickers” rotados, con sombra y borde 500 */}
        <h1
          ref={titleRef}
          className="mx-auto font-extrabold leading-tight text-5xl sm:text-6xl md:text-7xl text-foreground"
        >
          Convierte{' '}
          <span className="sticker relative z-10 inline-flex items-center gap-2 rounded-2xl bg-background px-3 py-1.5 md:px-4 md:py-2 border border-border rotate-[-4deg] shadow-[0_10px_25px_rgba(2,132,199,0.12)]">
            <MessageCircle className="h-5 w-5 md:h-6 md:w-6 text-sky-600" aria-hidden />
            <span className="align-middle">conversaciones</span>
          </span>{' '}
          en{' '}
          <span className="sticker relative inline-flex items-center gap-2 rounded-2xl bg-background px-3 py-1.5 md:px-4 md:py-2 border border-border rotate-[4deg] shadow-[0_12px_28px_rgba(99,102,241,0.12)]">
            <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-blue-700" aria-hidden />
            <span className="align-middle">ventas</span>
          </span>{' '}
          sin{' '}
          <span className="sticker relative z-10 inline-flex items-center gap-2 rounded-2xl bg-background px-3 py-1.5 md:px-4 md:py-2 border border-border rotate-[-4deg] shadow-[0_10px_24px_rgba(245,158,11,0.14)]">
            <Zap className="h-5 w-5 md:h-6 md:w-6 text-amber-500" aria-hidden />
            <span className="align-middle">fricción</span>
          </span>{' '}
          en{' '}
          <span className="sticker relative inline-flex items-center gap-2 rounded-2xl bg-background px-3 py-1.5 md:px-4 md:py-2 border border-border rotate-[4deg] shadow-[0_10px_24px_rgba(79,70,229,0.12)]">
            <Gauge className="h-5 w-5 md:h-6 md:w-6 text-indigo-600" aria-hidden />
            <span className="align-middle">tiempo récord</span>
          </span>
        </h1>

        {/* Subcopy un poco más marcado */}
        <p ref={subRef} className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-muted-foreground">
          Chat 24/7 que responde dudas, genera links de pago automáticamente y entiende audios, fotos
          y mensajes de texto. Conecta tu tienda y convierte cada conversación en una venta.
        </p>

        {/* CTA — seguimos usando tu clase */}
        <div className="mt-9 flex flex-col gap-1 items-center justify-center">
          <Button
            ref={btnRef}
            onClick={() => ctaFunction()}
            size="lg"
            className="btn-cta-primary relative z-10 group py-6 transition-all duration-300 will-change-transform"
          >
        <span className="inline-flex items-center gap-2 text-lg font-semibold">
              Unirse a la lista de espera
              <svg
                className="h-4 w-4 translate-x-0 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
        </span>
          </Button>
          <span className="text-sm text-gray-500">Prueba gratuita de 3 dias </span>
        </div>
      </div>
    </section>
  )
}
