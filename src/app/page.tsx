'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Check,
  MessageSquare,
  ShoppingCart,
  CreditCard,
  Zap,
  Shield,
  Globe,
  Bot,
  Link as LinkIcon,
  Headphones,
  Star,
  ChevronDown,
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import FeaturesGrid from '@/components/landing/features/features-grid'
import Hero from '@/components/landing/hero/Hero'
import Header from '@/components/landing/header'
import Pricing from '@/components/landing/pricing'
import { InputRow } from '@/components/ui/Forms/InputRow'
import ComparisonTable from '@/components/landing/compare-pricing'
import FaqSection from '@/components/landing/accordion-faqs'
import ToggleDarkMode from '@/components/ui/toggle-dark-mode'

const WaitlistDialog = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unirse a la lista de espera</DialogTitle>
         <form>
         <InputRow label="Nombre" name="name" placeholder="Nombre" type="text" props={{ required: true, className: 'mb-4' }} />
          <InputRow label="Email" name="email" placeholder="Email" type="email" props={{ required: true, className: 'mb-4' }} />
          <Button className='btn-cta-primary w-full mt-4' type='submit' size='lg' >Unirse</Button>
         </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default function LandingPage() {



  const [isWaitlistDialogOpen, setIsWaitlistDialogOpen] = useState(false)
  return (
    <div className="min-h-screen relative">
      <WaitlistDialog open={isWaitlistDialogOpen} onOpenChange={setIsWaitlistDialogOpen} />
      {/* Floating Navigation */}
      <Header />
      <main>
        {/* Hero Section */}
       <Hero ctaFunction={() => setIsWaitlistDialogOpen(true)} />

        {/* New Features Dashboard Section */}
          <FeaturesGrid />


        {/* Features Section 
        <section id="features" className="py-20 ">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Todo lo que necesitas para vender más
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Un chatbot inteligente que realmente entiende a tus clientes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                    <feature.icon className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>*/}

        {/* Pricing Section */}
        <Pricing />

        {/* Compare Pricing Section */}
        <ComparisonTable />

        {/* Faqs Section */}
        <FaqSection />

        {/* CTA Section */}
        <section className="py-20 bg-[var(--background)] ">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              ¿Listo para vender más?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Únete a miles de vendedores que ya están aumentando sus ventas con Botivent
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="cta-primary text-lg px-8 py-4 h-14">
                Empezar gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
        <section>
          
        </section>
      </main>
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
      `}</style>
    </div>
  )
}