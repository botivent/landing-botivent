'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Card } from '@/components/ui/card'

const DUMMY_FAQS = [
  { q: '¿Tiempo de envío?', a: '2-5 días laborables' },
  { q: '¿Devoluciones?', a: 'Hasta 30 días' },
  { q: '¿Materiales?', a: '100% algodón' },
  { q: '¿Envío gratuito?', a: 'Sí, en pedidos superiores a 50€' },
  { q: '¿Garantía?', a: '2 años de garantía en todos los productos' },
  { q: '¿Tallas disponibles?', a: 'XS, S, M, L, XL, XXL' },
  { q: '¿Colores disponibles?', a: 'Negro, blanco, azul, rojo, verde' },
  { q: '¿Pago a plazos?', a: 'Sí, hasta 12 meses sin intereses' },
  { q: '¿Seguimiento del pedido?', a: 'Recibirás actualizaciones por email y SMS' },
  { q: '¿Atención al cliente?', a: '24/7 por chat, email y teléfono' },
]

const SPEED_PX_PER_SEC = 10

export default function FaqsCard() {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const blockARef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (!wrapperRef.current || !blockARef.current) return

    const ctx = gsap.context(() => {
      const measure = () => blockARef.current!.offsetHeight
      let height = measure()

      const setup = () => {
        gsap.killTweensOf(wrapperRef.current)
        height = measure()

        gsap.set(wrapperRef.current, { y: height, force3D: true })

        const duration = (height * 2) / SPEED_PX_PER_SEC
        const wrapY = gsap.utils.wrap(-height, 0)
        const snap05 = gsap.utils.snap(0.5)

        gsap.to(wrapperRef.current, {
          y: `-=${height * 2}`,
          ease: 'none',
          duration,
          repeat: -1,
          force3D: true,
          modifiers: {
            y: (y) => `${wrapY(snap05(parseFloat(y)))}px`,
          },
        })
      }

      setup()
      const ro = new ResizeObserver(() => setup())
      ro.observe(blockARef.current)

      return () => ro.disconnect()
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  return (
    <Card className="bg-background h-full relative overflow-hidden">
      {/* Fades superior/inferior */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 z-1 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80 to-transparent" />
      <div className="pointer-events-none absolute top-[80px] left-0 right-0 h-30 z-1 bg-gradient-to-b from-[var(--background)] from-70% via-[var(--background)]/90 to-transparent" />
      <div className="px-6 relative z-2">
        <h3 className="text-xl font-semibold text-foreground mb-3">
          Añade preguntas frecuentes y otros datos.
        </h3>
        <p className="text-foreground text-sm">
          Asegúrate de que tu chat pueda responder con todos los datos posibles.
        </p>
      </div>

      {/* Viewport */}
      <div className="absolute inset-x-0 bottom-0 top-28 overflow-hidden">
        {/* Padre que se mueve */}
        <div
          ref={wrapperRef}
          className="w-full flex flex-col space-y-0 will-change-transform [backface-visibility:hidden] [transform:translateZ(0)]"
        >
          {/* A */}
          <div ref={blockARef} className="px-6">
            {DUMMY_FAQS.map((item, i) => (
              <div key={`a-${i}`} className="border rounded-lg p-3 mb-3">
                <div className="text-sm font-medium text-foreground">{item.q}</div>
                <div className="text-sm text-muted-foreground mt-1">{item.a}</div>
              </div>
            ))}
          </div>

          {/* B */}
          <div className="px-6">
            {DUMMY_FAQS.map((item, i) => (
              <div key={`b-${i}`} className="border rounded-lg p-3 mb-3">
                <div className="text-sm font-medium text-foreground">{item.q}</div>
                <div className="text-sm text-muted-foreground mt-1">{item.a}</div>
              </div>
            ))}
          </div>

          {/* A2 */}
          <div className="px-6">
            {DUMMY_FAQS.map((item, i) => (
              <div key={`a2-${i}`} className="border rounded-lg p-3 mb-3">
                <div className="text-sm font-medium text-foreground">{item.q}</div>
                <div className="text-sm text-muted-foreground mt-1">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
