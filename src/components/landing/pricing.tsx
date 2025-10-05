'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import NumberFlow, { continuous } from '@number-flow/react'
import { Toggle } from '../ui/toggle'
import { Switch } from '../ui/switch'

type Billing = 'monthly' | 'annual'

export default function PricingSection() {
  const [billing, setBilling] = useState<Billing>('monthly')
  const trend = billing === 'annual' ? -1 : 1

  // precios mensuales
  const PRICE_FREE = 0
  const PRICE_STARTER = 29
  const PRICE_PRO = 59

  // anual: 2 meses gratis → precio/mes mostrado
  const toAnnual = (p: number) => Math.round((p * 10) / 12)
  const starter = billing === 'monthly' ? PRICE_STARTER : toAnnual(PRICE_STARTER) // 29 → 24
  const pro = billing === 'monthly' ? PRICE_PRO : toAnnual(PRICE_PRO) // 59 → 49

  return (
    <section className="relative bg-[var(--background)] py-20" id="pricing">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-20">
          <h2 className="ticker inline-flex items-center gap-2 rounded-2xl bg-background px-4 py-2 border border-border rotate-[6deg] shadow-[0_10px_25px_#2563eb33] text-2xl font-bold text-foreground">
            Planes
          </h2>
        </div>

        {/* Toggle (un poco más pequeño). Gris en Monthly, gray-1200 en Annual. Labels más pequeños */}
        <div className="mb-20 flex items-center justify-center gap-3">
          <button
            onClick={() => setBilling('monthly')}
            className={`text-sm md:text-base text-gray-1000`}
          >
            Mensual
          </button>

          <Switch
            checked={billing === 'annual'}
            onCheckedChange={() => setBilling((b) => (b === 'monthly' ? 'annual' : 'monthly'))}
          />

          <button
            onClick={() => setBilling('annual')}
            className={`text-sm md:text-base text-gray-1000`}
          >
            Anual
          </button>

          <div className="relative ml-2 hidden sm:block">
            <svg
              viewBox="0 0 120 60"
              className="pointer-events-none absolute -left-8 -top-6 h-7 w-20 text-gray-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
            >
              <path d="M10,40 C45,10 85,10 110,20" />
              <path d="M100,15 l15,2 l-10,12" />
            </svg>
            <span className="inline-flex items-center rounded-full bg-[#2563EB] px-4 py-1.5 text-xs font-semibold text-white">
              2 MESES GRATIS
            </span>
          </div>
        </div>

        {/* Cards más grandes; la del centro ligeramente más grande */}
        <div className="flex flex-row gap-10 justify-center">

          {/* Starter (centro) — un poco más grande */}
          <div className="relative rounded-2xl bg-[var(--background)] p-12 md:p-12 border   shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-block rounded-full bg-[#2563EB] px-3 py-1 text-xs font-semibold text-white">Más popular</span>
            </div>

            <h3 className="text-foreground text-xl font-semibold">Intermedio</h3>

            <div className="mt-6 flex items-end gap-2">
              <span className="text-5xl font-extrabold text-foreground [font-variant-numeric:tabular-nums]">
                <NumberFlow
                  value={starter}
                  plugins={[continuous]}
                  trend={trend}
                  locales="es-ES"
                  format={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }}
                />
              </span>
              <span className="text-base md:text-lg text-muted-foreground">/mes</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {billing === 'annual' ? 'Por mes facturado anualmente.' : 'Por mes facturado mensualmente.'}
            </p>

            <ul className="mt-7 space-y-3 text-sm">
              <li className="flex items-start gap-2 text-foreground"><Check className="h-4 w-4 text-foreground mt-0.5" /> 300 respuestas/mes.</li>
              <li className="flex items-start gap-2 text-foreground"><Check className="h-4 w-4 text-foreground mt-0.5" /> 1 link de tienda.</li>
              <li className="flex items-start gap-2 text-foreground"><Check className="h-4 w-4 text-foreground mt-0.5" /> Ilimitados productos.</li>
              <li className="flex items-start gap-2 text-foreground"><Check className="h-4 w-4 text-foreground mt-0.5" /> Ilimitados links de pago manuales.</li>
              <li className="flex items-start gap-2 text-foreground"><Check className="h-4 w-4 text-foreground mt-0.5" /> Soporte por email prioritario.</li>
            </ul>

            <div className="mt-9">
            <Button variant="outline" className="w-full py-5 btn-cta-primary">Empezar</Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
                {billing === 'annual' ? '3 días de prueba.' : '3 días de prueba.'}
              </p>
            </div>
          </div>

          {/* Pro */}
          <div className="relative rounded-2xl bg-[var(--background)] p-10 md:p-12 border  shadow-lg">
            <h3 className="text-gray-1100 text-xl font-semibold">Premium</h3>

            <div className="mt-6 flex items-end gap-2">
              <span className="text-5xl  font-extrabold text-gray-1100 [font-variant-numeric:tabular-nums]">
                <NumberFlow
                  value={pro}
                  plugins={[continuous]}
                  trend={trend}
                  locales="es-ES"
                  format={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }}
                />
              </span>
              <span className="text-base md:text-lg text-muted-foreground">/mes</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {billing === 'annual' ? 'Por mes facturado anualmente.' : 'Por mes facturado mensualmente.'}
            </p>

            <ul className="mt-7 space-y-3 text-sm">
              <li className="flex items-start gap-2 text-foreground"><Check className="h-4 w-4 text-foreground mt-0.5" /> Ilimitadas respuestas.</li>
              <li className="flex items-start gap-2 text-foreground"><Check className="h-4 w-4 text-foreground mt-0.5" /> 1 link de tienda.</li>
              <li className="flex items-start gap-2 text-foreground"><Check className="h-4 w-4 text-foreground mt-0.5" /> Ilimitados productos.</li>
              <li className="flex items-start gap-2 text-foreground"><Check className="h-4 w-4 text-foreground mt-0.5" /> Ilimitados links de pago manuales.</li>
              <li className="flex items-start gap-2 text-foreground"><Check className="h-4 w-4 text-foreground mt-0.5" /> Soporte por email prioritario.</li>
            </ul>

            <div className="mt-9">
              <Button variant="outline" className="w-full py-5">Empezar</Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">3 días de prueba.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
