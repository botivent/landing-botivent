"use client"

import React, { useState } from "react"
import NumberFlow from "@number-flow/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function PricingStep({
  plans,
  selectedPlan,
  selectedPrice,
  onSelect,
  onBack,
  onProceed,
  submitting,
  buttonText,
  ...props
}: any) {
  const [billing, setBilling] = useState<any>("month") // "month" | "year"

  const getPriceForPlan = (plan: any) => {
    if (!plan?.plan_prices) return null
    const desired = plan.plan_prices.find((p: any) => p.interval === (billing === "year" ? "year" : "month"))
    return desired || plan.plan_prices[0] || null
  }

  const getDisplayPrice = (price: any) => {
    if (!price) return 0
    if (billing === "year" && price.interval === "year") {
      // Para anual, mostrar el precio mensual equivalente (precio anual / 12)
      return Number(price.amount_cents) / 100 / 12
    }
    return Number(price.amount_cents) / 100
  }

  const visiblePlans = Array.isArray(plans) ? plans : []

  return (
    <div className="flex flex-col gap-8 justify-center items-center" {...props}>
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-2xl font-bold">Selecciona tu plan</h2>
        <div className="flex items-center gap-3 p-1 bg-muted rounded-lg">
          <Button 
            variant={billing === "month" ? "default" : "ghost"} 
            onClick={() => setBilling("month")}
            size="sm"
            className="px-6"
          >
            Mensual
          </Button>
          <Button 
            variant={billing === "year" ? "default" : "ghost"} 
            onClick={() => setBilling("year")}
            size="sm"
            className="px-6"
          >
            Anual
          </Button>
        </div>
      </div>

      <div className="flex flex-row gap-6 justify-center">
        {visiblePlans.length > 0 ? (
          visiblePlans.map((plan: any) => {
            const price = getPriceForPlan(plan)
            const displayPrice = getDisplayPrice(price)
            const isActivePlan = selectedPlan?.slug === plan.slug
            const isPopular = plan.slug === "pro"
            
            return (
              <Card 
                key={plan.slug} 
                className={`relative flex-1 max-w-sm  gap-0cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 px-6 ${
                  isActivePlan ? "ring-2 ring-primary shadow-xl -translate-y-1" : "shadow-md"
                }`}
                onClick={() => {
                  if (price) {
                    onSelect?.(plan, price)
                  }
                }}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge variant="default" className="bg-primary text-white px-3 py-1 text-xs font-semibold">
                      Más popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-0">
                  <CardTitle className="text-xl font-bold flex items-center justify-between">
                    <span>{plan.name}</span>
                    {price?.trial_days > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1 text-xs font-semibold">
                      {price.trial_days} días de prueba
                    </Badge>
                )}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">
                      <NumberFlow
                        value={displayPrice}
                        locales="es-ES"
                        format={{ 
                          style: "currency", 
                          currency: String(price?.currency || "EUR").toUpperCase(), 
                          maximumFractionDigits: 0 
                        }}
                      />
                    </span>
                    <span className="text-lg text-muted-foreground">/ mes</span>
                  </div>
                  {billing === "month" && (
                    <p className="text-muted-foreground leading-relaxed">Por mes facturado mensualmente.</p>
                  )}
                  {billing === "year" && (
                    <p className="text-muted-foreground leading-relaxed">Por mes facturado anualmente.</p>
                  )}

                  {Array.isArray(plan.bullet_points) && plan.bullet_points.length > 0 && (
                    <ul className="space-y-3">
                      {plan.bullet_points.map((bp: any, idx: any) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm leading-relaxed">{bp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="text-muted-foreground text-center py-12 w-full">
            No hay planes disponibles
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 max-w-sm">
        <Button 
          onClick={onProceed} 
          disabled={submitting}
          loading={submitting}
          size="lg"
          className="px-8"
        >
          {submitting ? "Procesando…" : buttonText || "Continuar"}
        </Button>
      </div>
    </div>
  )
}
