'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SiShopify, SiWoocommerce, SiPrestashop } from "react-icons/si";

export default function DashboardCard() {
  const [progress, setProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)
  const [selectedPreview, setSelectedPreview] = useState(1)
  const [showImages, setShowImages] = useState([false, false, false, false])
  const [showFields, setShowFields] = useState([false, false, false, false])

  useEffect(() => {
    if (isAnimating) {
      // Animación de imágenes
      const imageTimer = setTimeout(() => {
        setShowImages([true, false, false, false])
        setTimeout(() => setShowImages([true, true, false, false]), 300)
        setTimeout(() => setShowImages([true, true, true, false]), 600)
        setTimeout(() => setShowImages([true, true, true, true]), 900)
      }, 500)

      // Animación de campos
      const fieldTimer = setTimeout(() => {
        setShowFields([true, false, false, false])
        setTimeout(() => setShowFields([true, true, false, false]), 400)
        setTimeout(() => setShowFields([true, true, true, false]), 800)
        setTimeout(() => setShowFields([true, true, true, true]), 1200)
      }, 1000)

      return () => {
        clearTimeout(imageTimer)
        clearTimeout(fieldTimer)
      }
    }
  }, [isAnimating])

  const handleRefine = () => {
    setShowImages([false, false, false, false])
    setShowFields([false, false, false, false])
    setIsAnimating(true)
  }

  return (
    <Card className="bg-background gap-0 relative flex h-full flex-col overflow-hidden ">
      <div className="px-6">
        <div className="">
          {' '}
          <h3 className="text-xl font-semibold text-foreground mb-3">Edita tus productos</h3>
          <p className="text-foreground text-sm">
            Edita y gestiona tus productos de forma sencilla. Añade imágenes, descripciones y
            precios con nuestra interfaz intuitiva.
          </p>
        </div>
      </div>

      {/* Dashboard de Edición de Productos - Con efecto cropeado */}
      <div className="overflow-hidden ">
        <div className="  bg-backgroundrelative w-full  -mr-[20%] p-6 ">
          <div className="w-[120%]  border rounded-lg max-h-130 overflow-hidden ">
            {/* Header */}
            <div className="flex items-center p-4 border-b">
              <div className="rounded text-sm text-foreground flex items-center gap-1 border  px-3 py-2">
                <span className="mr-2">←</span>
                <span>Volver</span>
              </div>
              <div className="ml-4 font-medium">Camiseta blanca</div>
            </div>

            {/* Contenido principal - Layout de dos columnas */}
            <div className="flex w-full">
              {/* Columna izquierda - Imágenes */}
              <div className="flex-1 p-4 border-r pb-0 w-[40%]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-foreground">Imágenes</h4>
                  <button className="text-muted-foreground hover:text-muted-foreground">+</button>
                </div>

                {/* Grid de imágenes */}
                <div className="grid grid-cols-1 gap-3 overflow-hidden max-w-auto ">
                  <div
                    className={`aspect-square bg-muted rounded border flex items-center justify-center transition-all duration-500 ${
                      showImages[0] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                  >
                    <div className="text-xs text-muted-foreground">Imagen 1</div>
                  </div>
                  <div
                    className={`aspect-square bg-muted rounded border flex items-center justify-center transition-all duration-500 ${
                      showImages[1] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                  >
                    <div className="text-xs text-muted-foreground">Imagen 2</div>
                  </div>
                  <div
                    className={`aspect-square bg-muted rounded border flex items-center justify-center transition-all duration-500 ${
                      showImages[2] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                  >
                    <div className="text-xs text-muted-foreground">Imagen 3</div>
                  </div>
                </div>
              </div>

              {/* Columna derecha - Detalles del producto (cropeada) */}
              <div className="w-[60%] p-4 pr-12">
                {/* Título */}
                <div
                  className={`mb-4 transition-all duration-500 ${
                    showFields[0] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
                >
                  <label className="text-xs text-foreground block mb-1">Título</label>
                  <div className="h-9 border rounded-lg px-3 flex items-center bg-background">
                    <span className="text-sm text-foreground">Camiseta blanca</span>
                  </div>
                </div>

                {/* Descripción */}
                <div
                  className={`mb-4 transition-all duration-500 ${
                    showFields[1] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
                >
                  <label className="text-xs text-foreground block mb-1">Descripción</label>
                  <div className="min-h-[96px] border rounded-lg px-3 py-2 bg-background">
                    <p className="text-sm text-foreground">100% algodón. Hecho en España.</p>
                  </div>
                </div>

                {/* Precio Base */}
                <div
                  className={`mb-4 transition-all duration-500 ${
                    showFields[2] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
                >
                  <label className="text-xs text-foreground block mb-1">Precio Base</label>
                  <div className="h-9 border rounded-lg px-3 flex items-center bg-background w-full">
                    <span className="text-sm text-foreground">19,99</span>
                  </div>
                </div>

                {/* Variantes */}
                <div
                  className={`mb-4 transition-all duration-500 ${
                    showFields[3] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
                >
                  <label className="text-xs text-foreground block mb-1">Variantes</label>
                  <div className="text-xs text-muted-foreground mb-2">
                    Añade atributos como talla, color o material
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-foreground mb-1">Atributos</div>
                      <div className="flex gap-2 p-2 border rounded-lg flex-col">
                        <div className="text-xs text-foreground mb-1 ">Talla</div>
                        <div className="flex gap-1">
                          {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                            <div
                              key={size}
                              className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded border flex flex-row"
                            >
                              {size} ×
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Variantes (4)</div>
                      <div className="text-xs text-muted-foreground">Talla: S</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlay para simular el cropeado */}
            <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-[var(--background)] to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* O conecta con */}
      <div className="flex flex-col  items-center px-6 gap-0 justify-start">
        <div className="text-sm text-foreground medium">O conecta con tu Ecommerce:</div>
        <div className="flex items-center gap-6 mt-4">
          <SiShopify className="w-10 h-10 text-foreground" />
          <SiWoocommerce className="w-10 h-10 text-foreground" />
          <SiPrestashop className="w-10 h-10 text-foreground" />
        </div>
      </div>
    </Card>
  )
}
