/**
 * 
 * Componente para el onboarding de la tienda.
 * 
 * @version 1.0.0
 * @since 2025-09-16
 * @author Gabriel Sanchez <gabriel@botivent.com>
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.hasStore - Indica si el usuario tiene una tienda
 * @param {Store['row'] | null} props.storeData - Datos de la tienda
 * @returns {JSX.Element} - Elemento JSX
 * 
 **/
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StoreType } from './store-type'
import { StoreSetup } from './store-setup'
import { ShopifySetup } from './shopify-setup'
import { usersController } from '../../../controllers/usersController'
import { useSearchParams } from 'next/navigation'
import { Button } from '../../ui/button'
import { API_BASE_URL } from '../../../lib/utils'
import { storesController } from '../../../controllers/storesController'
import { useBreadcrumbsPage } from '../../../hooks/use-breadcrumbs'
import type { Store } from '../../../lib/types'


interface StoreOnboardingProps {
  hasStore: boolean
  storeData: Store['row'] | null
}

const storeTypes = [
  {
    id: 'shopify',
    name: 'Shopify',
    icon: 'shopify',
    fields: ['storeDomain', 'apiKey', 'apiPassword'],
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    icon: 'woocommerce',
    fields: ['storeUrl', 'consumerKey', 'consumerSecret'],
  },
  {
    id: 'stripe',
    name: 'Nuestra Plataforma',
    icon: 'stripe',
    fields: ['stripeAccountId'],
    isCustom: true, // Add this flag to identify custom platform
  },
]

export function StoreOnboarding({ hasStore, storeData }: StoreOnboardingProps) {
  const searchParams = useSearchParams()
  const [step, setStep] = useState<'onboarding' | 'setup' | 'shopify' | 'error' | 'incomplete'>(
    hasStore ? 'setup' : 'onboarding',
  )
  const [selectedStoreType, setSelectedStoreType] = useState<string | null>(storeData?.type || null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingType, setLoadingType] = useState<string | null>(null)

  // Set breadcrumbs based on current step
  useBreadcrumbsPage( [
    { name: 'Tienda', path: '/panel/tienda' },
    { name: step === 'onboarding' ? 'Empezar' : step === 'setup' ? 'Configurar' : step === 'shopify' ? 'Shopify' : 'Error', path: '' }
  ])
  
  // Check URL parameters on component mount
  useEffect(() => {
    const error = searchParams.get('error')

    if (error === 'true') {
      // User returned from Stripe with an error
      setStep('error')
      setErrorMessage(
        'Algo salió mal con la conexión de Stripe. Por favor, inténtalo de nuevo.',
      )
    } else if (storeData?.is_active === false) {
      if (storeData?.type === 'shopify') {
        setStep('shopify')
      } 
    }
  }, [searchParams, storeData])

  const handleStoreTypeSelect = (type: string) => {
    setSelectedStoreType(type)

    if (type === 'shopify') {
      // Go to Shopify specific setup
      setStep('shopify')
    } else if (type === 'stripe') {
      // Start Stripe Connect onboarding process
      startStripeConnectOnboarding()
    } else {
      // Normal flow for other store types
      setStep('setup')
    }
  }

  const startStripeConnectOnboarding = async () => {
    setLoadingType('stripe')
    try {

      console.log('Iniciando onboarding de Stripe Connect...')
      const me = await usersController.getMe()
      console.log('Me:', me)

      // Create Stripe Connect account
      const response = await fetch(`${API_BASE_URL}/api/store/stripe/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'create-account',
          email: me?.user?.email,
          businessName: me?.user?.name,
        }),
      })
      console.log('Respuesta de crear cuenta:', response.status)

      if (response.status === 201) {
        const result = await response.json()

        console.log('Cuenta creada:', result)

        const store = await storesController.createStore({
            store_name: me?.user?.name || 'Tienda',
            store_description: me?.user?.email || 'Tienda',
            type: 'stripe',
            stripe_account_id: result.accountId || ''
          })
        console.log('Tienda creada:', store)
        const storeResult = store
        console.log('Tienda creada:', storeResult)
        // Get onboarding URL
        const statusResponse = await storesController.stripeConnect('get-status', result.accountId)

        console.log('Respuesta de obtener estado:', statusResponse.status)

        if (statusResponse.status === 'success') {
          const statusResult = statusResponse.data
          console.log('Resultado del estado:', statusResult)

          if (statusResult.onboardingUrl) {
            console.log('Abriendo URL de onboarding:', statusResult.onboardingUrl)
            // Open Stripe onboarding in new tab
            window.open(statusResult.onboardingUrl, '_blank')

            // You can also redirect or show a success message
            console.log('¡Onboarding de Stripe Connect iniciado!')
          } else {
            console.log('No se encontró URL de onboarding')
          }
        } else {
          console.error('Error al obtener el estado de la cuenta')
        }
      } else {
        console.error('Error al crear la cuenta')
        const error = await response.json()
        console.error('Error:', error)
      }
    } catch (error) {
      console.error('Error iniciando onboarding de Stripe Connect:', error)
    } finally {
      setLoadingType(null)
    }
  }

  const handleRetryStripeConnection = async () => {
    setStep('onboarding')
    setErrorMessage('')
    setIsLoading(false)
    // Clear any error state and restart the process
  }

  const handleContinueSetup = async () => {
    console.log('Continuando configuración para cuenta de Stripe:', storeData)
    if (storeData?.type === 'stripe' && storeData?.stripe_account_id) {
      console.log('Continuando configuración para cuenta de Stripe:', storeData.stripe_account_id)
      setIsLoading(true)
      // Try to get the onboarding URL for existing account
      try {
        const statusResponse = await storesController.stripeConnect('get-status', storeData.stripe_account_id)
        if (statusResponse.status === 'success') {
          const statusResult = statusResponse.data
          if (statusResult.onboardingUrl) {
            window.open(statusResult.onboardingUrl, '_self')
          }
        }
      } catch (error) {
        console.error('Error continuando configuración:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleShopifyComplete = () => {
    // Aquí puedes manejar la finalización del setup de Shopify
    toast.success('¡Configuración de Shopify completada!')
    // Redirigir o mostrar mensaje de éxito
  }

  return (
    <div className="w-full  h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-6xl">
          <AnimatePresence mode="wait">
            {step === 'onboarding' && (
              <motion.div
                key="onboarding"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <StoreType
                  storeTypes={storeTypes}
                  onSelect={handleStoreTypeSelect}
                  loadingType={loadingType}
                />
              </motion.div>
            )}

            {step === 'shopify' && (
              <motion.div
                key="shopify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="w-full flex justify-center"
              >
                <ShopifySetup
                  onBack={() => setStep('onboarding')}
                  onComplete={handleShopifyComplete}
                  storeData={storeData}
                />
              </motion.div>
            )}

            {step === 'setup' && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <StoreSetup
                  storeType={selectedStoreType || storeData?.type}
                  storeData={storeData}
                  onBack={() => setStep('onboarding')}
                />
              </motion.div>
            )}

            {step === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full flex justify-center"
              >
                <div className="max-w-md w-full bg-background rounded-xl shadow-lg p-8 border border-red-200">
                  <div className="text-center mb-6">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Error de Conexión</h2>
                    <p className="text-muted-foreground mb-6">{errorMessage}</p>
                  </div>
                  <div className="text-center">
                    <Button onClick={handleRetryStripeConnection} disabled={isLoading}>
                      Intentar de Nuevo
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'incomplete' && (
              <motion.div
                key="incomplete"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full flex justify-center"
              >
                <div className="max-w-md w-full bg-background rounded-xl p-8 border border-border">
                  <div className="text-center mb-6">
                    <h2 className="text-lg font-bold text-foreground mb-2">Configuración Incompleta</h2>
                    <p className="text-muted-foreground mb-6 text-sm">{errorMessage}</p>
                  </div>
                  <div className="text-center">
                    <Button onClick={handleContinueSetup} disabled={isLoading}>
                      Continuar Configuración
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
