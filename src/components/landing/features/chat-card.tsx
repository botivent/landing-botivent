'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ChevronLeft, Phone, Video, CreditCard, Link as LinkIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { SiWhatsapp, SiTelegram, SiInstagram, SiFacebook, SiX } from "react-icons/si";
type Msg =
  | { role: 'client'; type: 'text'; text: string }
  | { role: 'bot'; type: 'text'; text: string }
  | { role: 'bot'; type: 'payment' }

const MESSAGES: Msg[] = [
  {
    role: 'client',
    type: 'text',
    text:
      'Hey, me gustaría comprar una camiseta blanca, peso 70kg, ¿qué talla me quedaría bien?',
  },
  {
    role: 'bot',
    type: 'text',
    text:
      'Tu talla ideal sería la M. ¿Quieres que te envíe un link de pago para realizar el pedido?',
  },
  { role: 'client', type: 'text', text: '¡Sí!' },
  { role: 'bot', type: 'payment' },
  { role: 'client', type: 'text', text: '¡Muchas gracias, voy a hacer la compra!' },
]

export default function ChatCard() {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  // ⬇️ span “escribiendo…” debajo de Store
  const typingRef = useRef<HTMLSpanElement | null>(null)
  const msgRefs = useRef<HTMLDivElement[]>([])
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const setMsgRef = (el: HTMLDivElement | null, i: number) => {
    if (!el) return
    msgRefs.current[i] = el
  }

  useLayoutEffect(() => {
    if (!scrollRef.current) return

    const ctx = gsap.context(() => {
      gsap.set(msgRefs.current, { autoAlpha: 0, y: 8 })
     // gsap.set(typingRef.current, { autoAlpha: 0, display: 'none' })

      const tl = gsap.timeline({ defaults: { ease: 'power1.out' } })
      tlRef.current = tl

      // muestra/oculta el span "escribiendo..."
      const showTyping = (duration = 0.9) => {
      //  tl.set(typingRef.current, { display: 'inline', autoAlpha: 1 })
      //    .to(typingRef.current, { autoAlpha: 1, duration: duration })
      //    .set(typingRef.current, { autoAlpha: 0, display: 'none' })
      }

      const bringIn = (el: HTMLElement, fromX: number) => {
        tl.fromTo(
          el,
          { autoAlpha: 0, y: 8, x: fromX },
          { autoAlpha: 1, y: 0, x: 0, duration: 0.35 },
          '+=0.05',
        ).add(() => {
          if (!scrollRef.current) return
          gsap.to(scrollRef.current, {
            scrollTop: scrollRef.current.scrollHeight,
            duration: 0.3,
            ease: 'power1.out',
          })
        })
      }

      // secuencia: bot -> "escribiendo..." (topbar) -> mensaje; cliente -> mensaje
      MESSAGES.forEach((m, i) => {
        const el = msgRefs.current[i]
        if (!el) return
        if (m.role === 'bot') {
          showTyping(m.type === 'payment' ? 1.1 : 0.9)
          bringIn(el, -12)
        } else {
          bringIn(el, 12)
        }
      })
    }, wrapRef)

    return () => {
      ctx.revert()
      tlRef.current?.kill()
    }
  }, [])

  const replay = () => {
    if (!tlRef.current) return
    gsap.set(msgRefs.current, { autoAlpha: 0, y: 8, x: 0 })
  //  gsap.set(typingRef.current, { autoAlpha: 0, display: 'none' })
    if (scrollRef.current) scrollRef.current.scrollTop = 0
    tlRef.current.restart()
  }

  return (
    <Card className="bg-background gap-0 relative flex h-full flex-col overflow-hidden py-6 relative">
    <div
      ref={wrapRef}
      className="relative inset-px z-[1] rounded-lg max-lg:rounded-b-[2rem] lg:rounded-r-[2rem] overflow-hidden flex flex-col bg-background"
    >
      {/* Texto FUERA del chat */}
      <div className="px-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-3">Atiende a tus clientes 24/7 con un chat que vende por ti.</h3>
          <p className="text-foreground text-sm">
          Resuelve dudas al instante, genera links de pago automáticamente y entiende audios, fotos y texto.
          </p>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col p-6 pb-0 relative">
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 z-1 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80 to-transparent z-2"></div>

        {/* Top bar del chat: wrap en flex-col y span justo debajo */}
        <div className="flex items-center justify-between px-4 py-3 border border-border rounded-t-lg">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <ChevronLeft className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <div className="flex flex-col">
              <span className="rounded text-sm text-foreground medium">Tienda</span>
             
              </div>
              
            </div>
           
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground"
              aria-label="Phone"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Área scrolleable del chat (sin tocar nada más) */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 border-x border-border">
          <div className="flex flex-col gap-3 text-sm">
            {MESSAGES.map((m, i) => (
              <div
                key={i}
                ref={(el) => setMsgRef(el, i)}
                className={m.role === 'client' ? 'flex justify-end' : 'flex justify-start'}
              >
                {m.type === 'text' ? (
                  <div
                    className={[
                      'max-w-[80%] px-3 py-2 will-change-transform',
                      m.role === 'client'
                        ? 'rounded-2xl rounded-br-sm bg-[#3b82f61a] text-[#2563EB] border border-[#2563eb33]'
                        : 'rounded-2xl rounded-bl-sm bg-muted border border-border text-foreground',
                    ].join(' ')}
                  >
                    {m.text}
                  </div>
                ) : (
                  <div className="max-w-[80%] space-y-2">
                    <div className="rounded-2xl rounded-bl-sm  px-3 py-2 rounded-2xl rounded-bl-sm bg-muted border border-border text-foreground will-change-transform">
                      Te envío el link de pago generado automáticamente:
                    </div>

                    <div className="rounded-xl border border-border bg-muted px-3 py-2 will-change-transform">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background aspect-square">
                          <CreditCard className="h-4 w-4 text-foreground" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs uppercase tracking-wide text-muted-foreground">Pago seguro</div>
                          <div className="truncate text-sm font-medium text-foreground">
                            Camiseta Blanca - Link de pago
                          </div>
                          <div className="mt-1 inline-flex items-center gap-1 text-xs text-foreground">
                            <LinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
                            <span className="truncate text-muted-foreground  w-40">https://payments.botivent.com/camiseta-blanca</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>  

       {/* O conecta con */}
      <div className="flex flex-col  items-center px-6 gap-0 justify-start">
        <div className="text-sm text-foreground medium">Integrado con:</div>
        <div className="flex items-center gap-6 mt-4">
          <SiWhatsapp className="w-10 h-10 text-foreground" />
          <SiTelegram className="w-10 h-10 text-foreground" />
          <SiInstagram className="w-10 h-10 text-foreground" />
          <SiFacebook className="w-10 h-10 text-foreground" />
          <SiX className="w-10 h-10 text-foreground" />
        </div>
      </div>

    </div>
    </Card>
  )
}
