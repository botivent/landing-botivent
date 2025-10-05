"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, ExternalLink, Store, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { productsController } from "@/controllers/productsController"
import { storesController } from "@/controllers/storesController"
import { useBreadcrumbsPage } from "@/hooks/use-breadcrumbs"

export function StorefrontManager() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [store, setStore] = useState<any>(null)
  const [publicProducts, setPublicProducts] = useState<any[]>([])
  const [storefrontData, setStorefrontData] = useState({
    name: "",
    description: "",
    isActive: false,
    slug: ""
  })
  const [initialState, setInitialState] = useState({
    name: "",
    description: "",
    isActive: false,
    slug: ""
  })

  useEffect(() => {
    fetchStoreData()
  }, [])

  useBreadcrumbsPage([
    { name: "Panel", path: "/panel" },
    { name: "Tienda", path: "/panel/tienda" },
    { name: "Escaparate", path: "/panel/tienda/escaparate" },
  ])
  const fetchStoreData = async () => {
    try {
      setLoading(true)
      
      // Fetch store info
      const storeResult = await storesController.getStore()
      if (storeResult instanceof Error) {
        toast.error("Error al cargar la tienda")
        return
      }
      setStore(storeResult.store)

      // Fetch public products
      const productsResult = await productsController.getProducts()
      if (productsResult && Array.isArray(productsResult)) {
        const publicProducts = productsResult.filter((product: any) => product.is_public === true)
        setPublicProducts(publicProducts)
      }

      // Set initial storefront data
      const initialData = {
        name: storeResult.store.name || "",
        description: storeResult.store.description || "",
        isActive: storeResult.store.is_storefront_active || false,
        slug: storeResult.store.slug || ""
      }
      setStorefrontData(initialData)
      setInitialState(initialData)
    } catch (error) {
      console.error("Error fetching store data:", error)
      toast.error("Error al cargar los datos")
    } finally {
      setLoading(false)
    }
  }

  // Detectar cambios
  const hasChanges = useMemo(() => {
    return (
      storefrontData.name !== initialState.name ||
      storefrontData.description !== initialState.description ||
      storefrontData.isActive !== initialState.isActive ||
      storefrontData.slug !== initialState.slug
    )
  }, [storefrontData, initialState])

  const handleInputChange = (field: string, value: string) => {
    setStorefrontData(prev => ({ ...prev, [field]: value }))
  }

  const handleToggle = (field: string, value: boolean) => {
    setStorefrontData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      const result = await storesController.updateStore(store.id, {
        name: storefrontData.name,
        description: storefrontData.description,
        is_storefront_active: storefrontData.isActive,
        slug: storefrontData.slug
      })

      if (result instanceof Error) {
        toast.error("Error al actualizar la tienda")
        return
      }

      setStore(result)
      // Actualizar el estado inicial después del guardado exitoso
      setInitialState({
        name: storefrontData.name,
        description: storefrontData.description,
        isActive: storefrontData.isActive,
        slug: storefrontData.slug
      })
      toast.success("Escaparate actualizado correctamente")
    } catch (error) {
      console.error("Error updating store:", error)
      toast.error("Error al actualizar el escaparate")
    } finally {
      setSaving(false)
    }
  }

  const copyStorefrontLink = async () => {
    const url = `${window.location.origin}/storefront/${storefrontData.slug}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Enlace copiado al portapapeles")
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
      toast.error("Error al copiar al portapapeles")
    }
  }

  const openStorefrontLink = () => {
    const url = `${window.location.origin}/storefront/${storefrontData.slug}`
    window.open(url, '_blank')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price / 100)
  }

  if (!loading && store.type !== "stripe") {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">El escaparate esta solo disponible para tiendas Stripe</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Columna izquierda - Configuración del escaparate */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Configuración del Escaparate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Estado del escaparate */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {storefrontData.isActive ? (
                  <Eye className="h-5 w-5 text-green-600" />
                ) : (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">Escaparate Activo</p>
                  <p className="text-sm text-muted-foreground">
                    {storefrontData.isActive ? "Visible para clientes" : "Oculto para clientes"}
                  </p>
                </div>
              </div>
              <Switch
                checked={storefrontData.isActive}
                onCheckedChange={(checked) => handleToggle('isActive', checked)}
                disabled={saving}
              />
            </div>

            {/* Nombre de la tienda */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Nombre de la tienda *
              </Label>
              {loading ? (
                <Skeleton className="h-10 w-full mt-1" />
              ) : (
                <Input
                  id="name"
                  value={storefrontData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={saving}
                  className="mt-1"
                  placeholder="Nombre de tu tienda"
                />
              )}
            </div>

            {/* Descripción */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Descripción
              </Label>
              {loading ? (
                <Skeleton className="h-20 w-full mt-1" />
              ) : (
                <Textarea
                  id="description"
                  value={storefrontData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={saving}
                  className="mt-1"
                  rows={3}
                  placeholder="Describe tu tienda (opcional)"
                />
              )}
            </div>

            {/* Slug */}
            <div>
              <Label htmlFor="slug" className="text-sm font-medium">
                URL del escaparate
              </Label>
              <div className="flex gap-2 mt-1">
                {loading ? (
                  <Skeleton className="h-10 flex-1" />
                ) : (
                  <Input
                    id="slug"
                    value={storefrontData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    disabled={saving}
                    placeholder="mi-tienda"
                    className="flex-1"
                  />
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyStorefrontLink}
                  disabled={!storefrontData.slug || saving || loading}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openStorefrontLink}
                  disabled={!storefrontData.slug || saving || loading}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
                {loading ? (
                  <Skeleton className="h-3 w-48" />
                ) : storefrontData.slug ? (
                  <p className="text-xs text-muted-foreground mt-1">
                  {`${window.location.origin}/storefront/${storefrontData.slug}`}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                  {`Ingresa un slug para generar la URL`}
                  </p>
                )}
            </div>

            {/* Botón guardar */}
            <Button 
              onClick={handleSave} 
              disabled={saving || !storefrontData.name.trim() || !hasChanges}
              className="w-full"
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Columna derecha - Productos públicos */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Productos Públicos</span>
              {loading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <Badge variant="secondary">
                  {publicProducts.length} productos
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Skeleton className="w-12 h-12 rounded-md" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : publicProducts.length === 0 ? (
              <div className="text-center py-8">
                <EyeOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay productos públicos</p>
                <p className="text-sm text-muted-foreground">
                  Los productos marcados como públicos aparecerán en tu escaparate
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {publicProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    {/* Imagen del producto */}
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                      {product.media && product.media.length > 0 ? (
                        <img
                          src={product.media[0].url}
                          alt={product.media[0].alt || product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Store className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.variants?.length || 0} variante{(product.variants?.length || 0) !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Precio */}
                    <div className="text-right">
                      <p className="font-medium text-sm">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
