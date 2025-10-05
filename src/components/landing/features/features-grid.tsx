'use client'

import DashboardCard from './dashboard-card'
import StorefrontCard from './storefront-card'
import FaqsCard from './faqs-card'
import ChatCard from './chat-card'

export default function FeaturesGrid() {
  return (
    <section className="py-20 bg-background" id="features">
      <div className="mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="ticker relative z-10 inline-flex items-center gap-2 rounded-2xl bg-background px-3 py-1.5 md:px-4 md:py-2 border border-border rotate-[-4deg] shadow-[0_10px_24px_rgba(245,158,11,0.14)] text-xl font-bold text-foreground">
            Características
          </h2>
        </div>

        <div className="mx-auto max-w-xl px-6 lg:max-w-7xl lg:px-8">
          <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
            {/* Dashboard (alto, izquierda) */}
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-background lg:rounded-l-[2rem]" />
              <DashboardCard />
            </div>

            {/* Storefront (arriba centro) */}
            <div className="relative max-lg:row-start-1">
              <StorefrontCard />
            </div>

            {/* FAQs (abajo centro) */}
            <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2 pb-0">
              <FaqsCard />
            </div>

            {/* Chat (alto, derecha) */}
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-background max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]" />
              <ChatCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
