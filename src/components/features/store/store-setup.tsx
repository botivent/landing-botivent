'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { storesController } from '../../../controllers/storesController'
import { toast } from 'sonner'
import type { Store } from '../../../lib/types'

interface StoreSetupProps {
  storeType: string
  storeData?: Store['row'] | null
  onBack: () => void
}

const fieldConfigs = {
  shopify: [
    { key: 'storeDomain', label: 'Dominio de la Tienda', placeholder: 'tu-tienda.myshopify.com' },
    { key: 'apiKey', label: 'Clave API', placeholder: 'Ingresa tu clave API' },
    { key: 'apiPassword', label: 'Contraseña API', placeholder: 'Ingresa tu contraseña API' },
  ],
  woocommerce: [
    { key: 'storeUrl', label: 'URL de la Tienda', placeholder: 'https://tu-tienda.com' },
    { key: 'consumerKey', label: 'Clave del Consumidor', placeholder: 'Ingresa tu clave del consumidor' },
    { key: 'consumerSecret', label: 'Secreto del Consumidor', placeholder: 'Ingresa tu secreto del consumidor' },
  ],
}

export function StoreSetup({ storeType, storeData, onBack }: StoreSetupProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const fields = fieldConfigs[storeType as keyof typeof fieldConfigs] || []

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (storeData) {
        // Update existing store
        await storesController.updateStore({
          id: storeData.id,
          ...formData,
          enabled: true
        })
        toast.success('¡Tienda actualizada exitosamente!')
      } else {
        // Create new store
        await storesController.createStore({
          store_name: formData.storeName || 'Mi Tienda',
          store_description: formData.storeDescription || 'Descripción de la tienda',
          type: storeType,
          ...formData,
          enabled: true
        })
        toast.success('¡Tienda creada exitosamente!')
      }
      
      // Reload the page to trigger the layout check
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar la configuración de la tienda')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div 
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Configura tu Tienda de {storeType.charAt(0).toUpperCase() + storeType.slice(1)}
        </h1>
        <p className="text-muted-foreground text-lg">
          Ingresa las credenciales de tu tienda para conectar con Botivent
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Configuración de la Tienda</CardTitle>
            <CardDescription>
              Por favor, proporciona la información requerida para conectar tu tienda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {fields.map((field, index) => (
                <motion.div 
                  key={field.key} 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                >
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <Input
                    id={field.key}
                    type={field.key.includes('password') || field.key.includes('secret') || field.key.includes('token') ? 'password' : 'text'}
                    placeholder={field.placeholder}
                    value={formData[field.key] || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    required
                  />
                </motion.div>
              ))}

              <motion.div 
                className="flex gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={isLoading}
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
                      {storeData ? 'Actualizando...' : 'Creando...'}
                    </>
                  ) : (
                    storeData ? 'Actualizar Tienda' : 'Crear Tienda'
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
