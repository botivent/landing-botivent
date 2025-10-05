'use client'

import { ChevronDown } from 'lucide-react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

type FAQ = { q: string; a: string | React.ReactNode }

const FAQS: FAQ[] = [
  { q: '¿Es seguro usarlo?', a: 'Sí. Cumplimos GDPR y almacenamos datos de forma cifrada.' },
  { q: '¿Cómo aprende mi estilo?', a: 'Entrenas el asistente con ejemplos; el modelo adapta tono y respuestas.' },
  { q: '¿Edito manualmente las respuestas?', a: 'Puedes revisar y aprobar respuestas antes de enviarlas si quieres.' },
  { q: '¿Funciona en cualquier plataforma?', a: 'Sí, web y móvil. Integraciones con WhatsApp, IG, Webchat y más.' },
  { q: '¿Qué pasa tras la prueba gratis?', a: 'Puedes elegir un plan o seguir en Free sin coste.' },
  { q: '¿Cómo cancelo?', a: 'Desde tu panel → Billing → Cancelar. Sin permanencia.' },
]

export default function FaqSection() {
  return (
    <section className="bg-[var(--background)] py-16">
      <div className="mx-auto max-w-3xl px-4">
        {/* Título “sticker” a juego */}
        <div className="text-center mb-8">
          <h2 className="inline-flex items-center gap-2 rounded-2xl bg-background px-4 py-2 border border-border rotate-[-4deg] shadow-[0_10px_25px_#2563eb33] text-2xl font-bold text-foreground">
            Preguntas frecuentes
          </h2>
        </div>

        <div className="relative rounded-2xlbg-background">
          {/* borde superior gris 500 para encajar con tu estética */}
          <div className="pointer-events-none absolute inset-px rounded-2xl border border-border" />

          <Accordion type="single" collapsible className="relative z-[1] divide-y divide-border">
            {FAQS.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="px-4">
                <AccordionTrigger className="py-5 text-left hover:no-underline">
                  <span className="text-foreground font-medium">{item.q}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
