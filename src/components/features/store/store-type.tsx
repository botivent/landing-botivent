'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { FaShopify } from 'react-icons/fa'
import { SiWoo, SiStripe } from 'react-icons/si'

interface StoreType {
  id: string
  name: string
  description?: string
  icon: string
  fields: string[]
  isCustom?: boolean
}

interface StoreTypeProps {
  storeTypes: StoreType[]
  onSelect: (type: string) => void
  loadingType?: string | null
}

const iconMap = {
  shopify: FaShopify,
  woocommerce: SiWoo,
  stripe: SiStripe,
}

export function StoreType({ storeTypes, onSelect, loadingType }: StoreTypeProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Conecta con tu plataforma favorita
        </h1>
        <p className="text-muted-foreground text-lg">
          Para poder importar tus productos, manejar links de pagos y mucho más!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {storeTypes.map((storeType, index) => {
          const IconComponent = iconMap[storeType.icon as keyof typeof iconMap]
          
          return (
            <motion.div
              key={storeType.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="h-full cursor-pointer hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4 flex justify-center">
                    {IconComponent && <IconComponent className="w-12 h-12" />}
                  </div>
                  <CardTitle className="text-xl">{storeType.name}</CardTitle>
                  {storeType.description && (
                    <CardDescription className="text-sm">
                      {storeType.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    onClick={() => onSelect(storeType.id)}
                    disabled={loadingType === storeType.id}
                    className="w-full"
                    variant={storeType.isCustom ? "default" : "outline"}
                  >
                    {loadingType === storeType.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Conectando...
                      </>
                    ) : (
                      'Conectar'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
