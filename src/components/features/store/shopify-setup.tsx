'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { FaShopify } from 'react-icons/fa'
import { toast } from 'sonner'
import { API_BASE_URL } from '@/lib/utils'
import { Store } from '@/lib/types'

interface ShopifySetupProps {
  onBack: () => void
  onComplete: () => void
  storeData: Store['row'] | null
}

export function ShopifySetup({ onBack, onComplete, storeData }: ShopifySetupProps) {
  const [step, setStep] = useState<'domain' | 'redirect'>('domain')
  const [domain, setDomain] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shopifyUrl, setShopifyUrl] = useState('')

  useEffect(() => {
    if (storeData && storeData.shopify_domain) {
      setDomain(storeData.shopify_domain)
      setStep('redirect')
    }
  }, [storeData])

  // --- 1️⃣ Guardar dominio en el backend ---
  const handleDomainSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!domain.trim()) {
      toast.error('Por favor ingresa el dominio de tu tienda')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/store/shopify/domain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ domain }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Error al guardar el dominio')
      }
      setShopifyUrl(domain + '.myshopify.com')
      setStep('redirect')
      toast.success('Dominio guardado correctamente')
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar el dominio')
    } finally {
      setIsLoading(false)
    }
  }

  // --- 2️⃣ Obtener URL de conexión con Shopify ---
  const handleContinueToShopify = async () => {

    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/store/shopify/connect`, {
        credentials: 'include',
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Error al generar enlace de conexión')
      }

      const { url } = await response.json()
      if (!url) throw new Error('No se pudo generar el enlace de conexión')

      window.open(url, '_blank')
      toast.success('Redirigiendo a Shopify...')
    } catch (err: any) {
      toast.error(err.message || 'Error al conectar con Shopify')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {step === 'domain' && (
          <motion.div
            key="domain"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardHeader className="text-left pb-4">
                <div className="flex items-center mb-2">
                  <FaShopify className="w-12 h-12 text-foreground mr-3" />
                  <div>
                    <CardTitle className="text-2xl">Configurar Shopify</CardTitle>
                    <CardDescription>Introduce tu dominio</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDomainSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="domain">Dominio de tu tienda</Label>
                    <div className="flex">
                      <Input
                        id="domain"
                        type="text"
                        placeholder="tu-tienda"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="rounded-r-none"
                        required
                      />
                      <div className="flex items-center px-3 bg-muted border border-l-0 border-input rounded-r-md text-muted-foreground">
                        .myshopify.com
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onBack}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Atrás
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Guardando...
                        </>
                      ) : (
                        'Continuar'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'redirect' && (
          <motion.div
            key="redirect"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardHeader className="text-left pb-4">
                <div className="flex items-center mb-2">
                  <FaShopify className="w-12 h-12 text-foreground mr-3" />
                  <div>
                    <CardTitle className="text-2xl">Conectar con Shopify</CardTitle>
                    <CardDescription>
                      Verifica la conexión para confirmar tu tienda
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={handleContinueToShopify}
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Redirigiendo...
                      </>
                    ) : (
                      <>
                        <FaShopify className="w-4 h-4 mr-2" />
                        Continuar a Shopify
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setStep('domain')}
                    className="w-full"
                    disabled={isLoading}
                  >
                    Cambiar dominio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
