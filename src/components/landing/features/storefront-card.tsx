'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'

export default function StorefrontCard() {
  const [step, setStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    if (!isAnimating) return
    const timers: NodeJS.Timeout[] = []
    timers.push(setTimeout(() => setStep(1), 300))
    timers.push(setTimeout(() => setStep(2), 600))
    timers.push(setTimeout(() => setStep(3), 900))
    timers.push(setTimeout(() => setStep(4), 1200))
    timers.push(setTimeout(() => setStep(5), 1500))
    timers.push(setTimeout(() => setStep(6), 1800))
    timers.push(setTimeout(() => setIsAnimating(false), 2100))
    return () => timers.forEach(clearTimeout)
  }, [isAnimating])

  const handleReplay = () => {
    setStep(0)
    setIsAnimating(true)
  }

  return (
    <Card className="bg-background p-0 py-6 h-full flex flex-col pb-0 gap-0 overflow-hidden relative">
      <div className="absolute bottom-0 left-0 right-0 w-full h-8 z-1 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80 to-transparent pointer-events-none"></div>
      <div className="px-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">Enseña tus productos.</h3>
        <p className="text-sm text-foreground mb-0">
          Con un simple click muestra tus productos en un refinado storefront.
        </p>
      </div>

      {/* Mini Storefront Preview */}
      <div className="p-6 pb-0 max-h-55 overflow-hidden">
        <div className="relative flex-1 border rounded-xl">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-2 p-4 border-b">
            <div className="rounded text-sm text-foreground medium">Tienda</div>
            <div className="rounded text-sm text-foreground flex items-center gap-1 border px-2 py-1">
              <ShoppingCart className="w-4 h-4" /> Cart (0)
            </div>
          </div>

          {/* Products grid (1 fila, elementos más compactos) */}
          <div className="flex flex-col gap-2 max-h-auto">
            <div className="grid grid-cols-3 gap-2 px-2 py-1 ">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-2 transition-all duration-500 ${
                    step > i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <div className="aspect-[4/5] rounded bg-muted mb-1" />
                  <div className="h-2.5 bg-muted rounded w-10/12 mb-1" />
                  <div className="h-2.5 bg-muted rounded w-7/12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
