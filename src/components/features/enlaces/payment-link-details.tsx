"use client"

import { useState, useMemo, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, Loader2, Plus, Save, Trash2, Search, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Calendar22 } from "@/components/ui/date-picker"
import { useBreadcrumbsPage } from "@/hooks/use-breadcrumbs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { productsController } from "@/controllers/productsController"
import { paymentLinksController } from "@/controllers/paymentLinksController"
import { DialogFooter } from "@/components/ui/dialog"

interface PaymentLinkDetailsProps {
  isNew?: boolean
  paymentLink: {
    id: string
    store_id: string
    name: string
    description: string
    items: {
      product: {
        id: string
        media: {
          id: string
          alt: string
          url: string
          created_at: string
          product_id: string
          sort_order: number
        }[]
        price: {
          amount: number
        }
        title: string
      }
      variant: {
        id: string
        sku: string
        price: number
        stock: number
        attributes: {
          name: string
          value: string
        }[]
      }
      quantity: number
    }[]
    is_active: boolean
    expires_at: string | undefined
    max_uses: number | undefined
    usage_count: number
    is_shipping_address_required: boolean
    is_billing_address_required: boolean
    public_id: string
    created_at: string
    updated_at: string
  } | null
  onSave: (data: {
    name: string
    description: string
    items: any[]
    is_active: boolean
    is_shipping_address_required: boolean
    is_billing_address_required: boolean
    max_uses: number | null
    expires_at: string | null
  }) => Promise<void>
  loading?: boolean
  isSaving?: boolean
}

export const AddProductModal = ({ 
  isOpen, 
  onClose, 
  onAddProducts, 
  existingItems 
}: {
  isOpen: boolean
  onClose: () => void
  onAddProducts: (products: any[]) => void
  existingItems: any[]
}) => {
  const [availableProducts, setAvailableProducts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])
  const [selectedVariants, setSelectedVariants] = useState<{ [productId: string]: any }>({})
  const [showVariantDialog, setShowVariantDialog] = useState(false)
  const [currentProductForVariants, setCurrentProductForVariants] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchAvailableProducts()
    }
  }, [isOpen])

  const fetchAvailableProducts = async () => {
    setLoading(true)
    try {
      const response = await productsController.getProducts()
      if (response && Array.isArray(response)) {
        const available = response.filter((product: any) => {
          // If product has no variants, check if the product itself is already added
          if (!product.variants || product.variants.length === 0) {
            const isAlreadyAdded = existingItems.some(
              (item) => item.product.id === product.id && item.variant === null
            )
            return !isAlreadyAdded
          }

          // If product has variants, count how many variants of this product are already in the payment link
          const variantsInPaymentLink = existingItems.filter(
            (item) => item.product.id === product.id
          ).length

          // Product is available if not all variants are already added
          return variantsInPaymentLink < product.variants.length
        })
        setAvailableProducts(available)

        if (available.length === 0) {
          toast.info('Todos los productos ya están en este enlace de pago')
          onClose()
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  const handleProductSelection = (product: any) => {
    // Check if product has variants
    if (product.variants && product.variants.length > 0) {
      // Show variant selection dialog
      setCurrentProductForVariants(product)
      setShowVariantDialog(true)
    } else {
      // No variants, check if already selected
      const isSelected = selectedProducts.some((p) => p.id === product.id)
      if (isSelected) {
        setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id))
        // Remove variant selection when deselecting product
        const newSelectedVariants = { ...selectedVariants }
        delete newSelectedVariants[product.id]
        setSelectedVariants(newSelectedVariants)
      } else {
        // Add product
        setSelectedProducts([...selectedProducts, product])
      }
    }
  }

  const handleVariantSelection = (variant: any) => {
    if (!currentProductForVariants) return

    // Check stock - only if stock is not null (stock applies)
    if (variant.stock !== null && variant.stock !== undefined && variant.stock <= 0) {
      toast.error('Esta variante no tiene stock disponible')
      return
    }

    // Check if this specific variant is already selected
    const existingVariant = selectedVariants[currentProductForVariants.id]
    if (existingVariant && existingVariant.id === variant.id) {
      // Remove this variant
      const newSelectedVariants = { ...selectedVariants }
      delete newSelectedVariants[currentProductForVariants.id]
      setSelectedVariants(newSelectedVariants)

      // Remove product if no variants selected
      const hasOtherVariants = Object.keys(selectedVariants).some(
        (key) => key !== currentProductForVariants.id,
      )
      if (!hasOtherVariants) {
        setSelectedProducts(selectedProducts.filter((p) => p.id !== currentProductForVariants.id))
      }
    } else {
      // Add product with selected variant
      setSelectedProducts([...selectedProducts, currentProductForVariants])
      setSelectedVariants({
        ...selectedVariants,
        [currentProductForVariants.id]: variant,
      })
    }

    setShowVariantDialog(false)
    setCurrentProductForVariants(null)
  }

  const handleAddSelectedProducts = () => {
    if (selectedProducts.length === 0) return

    const newItems = selectedProducts.map((product) => {
      const selectedVariant = selectedVariants[product.id]
      const price = selectedVariant ? selectedVariant.price : product.price

      return {
        product: {
          id: product.id,
          title: product.title,
          price: { amount: price, currency: product.price.currency },
          media: product.media || [],
        },
        variant: selectedVariant ? selectedVariant : null,
        quantity: 1,
      }
    })

    onAddProducts(newItems)
    
    // Reset state
    setSelectedProducts([])
    setSelectedVariants({})
    setSearchTerm('')
    onClose()
  }

  const handleCloseModal = () => {
    // Reset all selections when closing
    setSelectedProducts([])
    setSelectedVariants({})
    setSearchTerm('')
    setCurrentProductForVariants(null)
    setShowVariantDialog(false)
    onClose()
  }

  const handleCloseVariantDialog = () => {
    setShowVariantDialog(false)
    setCurrentProductForVariants(null)
  }

  const filteredProducts = availableProducts.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price / 100)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Añadir Productos al Enlace de Pago</DialogTitle>
            <DialogDescription>
              Selecciona productos para añadir a tu enlace de pago. Los productos que ya están en el
              enlace no se muestran.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 flex flex-col gap-4 overflow-scroll">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Products List */}
            <div className="flex-1 overflow-y-auto border rounded-lg">
              {loading ? (
                <div className="grid grid-cols-2 gap-4 p-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <Skeleton className="w-24 h-24 mx-auto mb-3" />
                      <Skeleton className="h-4 w-3/4 mx-auto mb-1" />
                      <Skeleton className="h-3 w-1/2 mx-auto" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 p-4">
                  {filteredProducts.map((product) => {
                    const isSelected = selectedProducts.some((p) => p.id === product.id)
                    const hasSelectedVariants = selectedVariants[product.id]
                    const displaySelected = isSelected || hasSelectedVariants
                    return (
                      <div
                        key={product.id}
                        onClick={() => handleProductSelection(product)}
                        className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                          displaySelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex flex-col items-center text-center">
                          {/* Image at top */}
                          {product.media && product.media.length > 0 && (
                            <img
                              src={product.media[0].url}
                              alt={product.media[0].alt || product.title}
                              className="w-24 h-24 object-cover rounded mb-3"
                            />
                          )}

                          {/* Title and price at bottom */}
                          <div className="flex-1 min-w-0 w-full text-center">
                            <div className="font-semibold text-sm mb-1">{product.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatPrice(product.price)}
                            </div>
                          </div>

                          {/* Checkbox overlay */}
                          <div
                            className={`absolute top-2 right-2 w-5 h-5 rounded border-2 flex-shrink-0 ${
                              displaySelected ? 'bg-primary border-primary' : 'border-muted-foreground'
                            }`}
                          >
                            {displaySelected && (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-background rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
              <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {selectedProducts.length} producto{selectedProducts.length !== 1 ? 's' : ''}{' '}
                seleccionado{selectedProducts.length !== 1 ? 's' : ''}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddSelectedProducts}
                  disabled={selectedProducts.length === 0}
                >
                  Añadir {selectedProducts.length} Producto
                  {selectedProducts.length !== 1 ? 's' : ''}
                </Button>
              </div>
            </div>
        </DialogFooter>
        </DialogContent>

      </Dialog>

      {/* Variant Selection Dialog */}
      <Dialog open={showVariantDialog} onOpenChange={handleCloseVariantDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Seleccionar Variante</DialogTitle>
            <DialogDescription>
              Selecciona la variante de "{currentProductForVariants?.title}" que quieres añadir
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {currentProductForVariants?.variants
              ?.filter((variant: any) => {
                // Filter out variants that are already in the payment link
                const isAlreadyAdded = existingItems.some(
                  (item) =>
                    item.product.id === currentProductForVariants.id &&
                    item.variant?.id === variant.id,
                )
                return !isAlreadyAdded
              })
              .map((variant: any, index: number) => {
                const isOutOfStock =
                  variant.stock !== null && variant.stock !== undefined && variant.stock <= 0
                const variantName = variant.attributes
                  ? variant.attributes.map((attr: any) => `${attr.name}: ${attr.value}`).join(' / ')
                  : 'Sin atributos'
                
                // FIX: Solo mostrar como seleccionada la variante específica que está en selectedVariants
                const isSelected = selectedVariants[currentProductForVariants.id]?.id === variant.id

                return (
                  <div
                    key={index}
                    onClick={() => !isOutOfStock && handleVariantSelection(variant)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      isOutOfStock
                        ? 'bg-muted border-muted cursor-not-allowed opacity-50'
                        : isSelected
                          ? 'bg-primary/5 border-primary'
                          : 'hover:bg-muted/50 border-border'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{variantName}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatPrice(variant.price)}
                          {variant.stock !== null && variant.stock !== undefined && (
                            <span
                              className={`ml-2 ${isOutOfStock ? 'text-destructive' : 'text-green-600'}`}
                            >
                              {isOutOfStock ? 'Sin stock' : `${variant.stock} en stock`}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <div className="text-primary text-sm font-medium">Seleccionada</div>
                        )}
                        {isOutOfStock && <div className="text-destructive text-sm">No disponible</div>}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCloseVariantDialog}
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function PaymentLinkDetails({ paymentLink , onSave, loading = false, isNew = false, isSaving = false }: PaymentLinkDetailsProps) {
  const [localState, setLocalState] = useState({
    name: paymentLink?.name || "",
    description: paymentLink?.description || "",
    items: paymentLink?.items || [],
    is_active: paymentLink?.is_active ?? true,
    is_shipping_address_required: paymentLink?.is_shipping_address_required ?? false,
    is_billing_address_required: paymentLink?.is_billing_address_required ?? false,
    max_uses: paymentLink?.max_uses || null,
    expires_at: paymentLink?.expires_at ? new Date(paymentLink.expires_at) : null
  })

  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [initialState, setInitialState] = useState({
    name: paymentLink?.name || "",
    description: paymentLink?.description || "",
    items: paymentLink?.items || [],
    is_active: paymentLink?.is_active ?? true,
    is_shipping_address_required: paymentLink?.is_shipping_address_required ?? false,
    is_billing_address_required: paymentLink?.is_billing_address_required ?? false,
    max_uses: paymentLink?.max_uses || null,
    expires_at: paymentLink?.expires_at ? new Date(paymentLink.expires_at) : null
  })

  useEffect(() => {
    if (!loading && paymentLink) {
      const newState = {
    name: paymentLink.name,
    description: paymentLink.description,
    items: paymentLink.items,
    is_active: paymentLink.is_active,
    is_shipping_address_required: paymentLink.is_shipping_address_required,
    is_billing_address_required: paymentLink.is_billing_address_required,
        max_uses: paymentLink.max_uses || null,
        expires_at: paymentLink.expires_at ? new Date(paymentLink.expires_at) : null
      }
      setLocalState(newState)
      setInitialState(newState)
      setDate(paymentLink.expires_at ? new Date(paymentLink.expires_at) : null)
    }
  }, [paymentLink, loading])

  const [saving, setSaving] = useState(false)

  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [date, setDate] = useState<Date | null>(paymentLink?.expires_at ? new Date(paymentLink.expires_at) : null)

  // Trackear cambios en productos
  const hasProductChanges = useMemo(() => {
    if (isNew) return localState.items.length > 0 // For new payment links, any items count as changes
    if (!paymentLink) return false
    if (localState.items.length !== initialState.items.length) return true
    
    return localState.items.some((item, index) => {
      const originalItem = initialState.items[index]
      if (!originalItem) return true
      return item.quantity !== originalItem.quantity
    })
  }, [localState.items, initialState.items, isNew])

  // Trackear cambios en información general
  const hasInfoChanges = useMemo(() => {
    if (isNew) {
      return localState.name !== "" || 
             localState.description !== "" || 
             localState.max_uses !== null ||
             date !== null
    }
    if (!paymentLink) return false
    return (
      localState.name !== initialState.name ||
      localState.description !== initialState.description ||
      localState.is_active !== initialState.is_active ||
      localState.is_shipping_address_required !== initialState.is_shipping_address_required ||
      localState.is_billing_address_required !== initialState.is_billing_address_required ||
      date !== initialState.expires_at ||
      localState.max_uses !== initialState.max_uses
    )
  }, [
    localState.name,
    localState.description,
    localState.is_active,
    localState.is_shipping_address_required,
    localState.is_billing_address_required,
    date,
    localState.max_uses,
    initialState.name,
    initialState.description,
    initialState.is_active,
    initialState.is_shipping_address_required,
    initialState.is_billing_address_required,
    initialState.expires_at,
    initialState.max_uses,
    isNew
  ])

  // Cambios totales
  const hasChanges = hasProductChanges || hasInfoChanges

  const handleInputChange = (field: string, value: string) => {
    setLocalState(prev => ({ ...prev, [field]: value }))
  }

  const handleToggle = (field: string, value: boolean) => {
    setLocalState(prev => ({ ...prev, [field]: value }))
  }

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return

    const item = localState.items[index]

    // Check stock if variant exists and stock is not null (stock applies)
    if (
      item.variant &&
      item.variant.stock !== null &&
      item.variant.stock !== undefined &&
      newQuantity > item.variant.stock
    ) {
      toast.error(`No hay suficiente stock. Máximo disponible: ${item.variant.stock}`)
      return
    }

    const newItems = [...localState.items]
    newItems[index] = { ...newItems[index], quantity: newQuantity }
    setLocalState(prev => ({ ...prev, items: newItems }))
  }

  const handleRemoveItem = (index: number) => {
    const newItems = [...localState.items]
    newItems.splice(index, 1)
    setLocalState(prev => ({ ...prev, items: newItems }))
  }

  const handleAddProduct = () => {
    setShowAddProductModal(true)
  }

  const handleAddProducts = (newProducts: any[]) => {
    const updatedItems = [...localState.items, ...newProducts]
    setLocalState(prev => ({ ...prev, items: updatedItems }))
    
    const productNames = newProducts.map((p) => p.product.title).join(', ')
    toast.success(`Añadidos: ${productNames}`)
  }

  const handleSave = async () => {
    await onSave({
      name: localState.name,
      description: localState.description,
      items: localState.items,
      is_active: localState.is_active,
      is_shipping_address_required: localState.is_shipping_address_required,
      is_billing_address_required: localState.is_billing_address_required,
      max_uses: localState.max_uses ?? null,
      expires_at: date ? date.toISOString() : null
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price / 100)
  }

  const copyToClipboard = async () => {
    const url = `${window.location.origin}/payment/${paymentLink?.public_id}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Payment link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      toast.error('Error al copiar al portapapeles')
    }
  }

  useBreadcrumbsPage([
    {
      name: "Panel", path: "/panel"
    },
    {
      name: "Tienda", path: "/panel/tienda"
    },
    {
      name: "Enlaces de pago", path: "/panel/tienda/enlaces"
    },
    {
      name: paymentLink?.name || "Cargando...", 
      path: paymentLink?.id ? `/panel/tienda/enlaces-de-pago/${paymentLink?.id}` : "#"
    }
  ])

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {loading ? (
              <Skeleton className="h-8 w-48" />
            ) : (
              <>
                {isNew ? (
                  <h1 className="text-2xl font-bold">Nuevo Enlace de Pago</h1>
                ) : (
                  <h1 className="text-2xl font-bold">{paymentLink?.name}</h1>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleSave} 
              disabled={loading || isSaving || (!hasChanges && !isNew)}
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? (isNew ? "Creando..." : "Guardando...") : (isNew ? "Crear Enlace" : "Guardar Cambios")}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Lado izquierdo - Inputs y tabla de productos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card con inputs de título y descripción */}
          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2" htmlFor="name">Título</Label>
                {loading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                <Input
                  id="name"
                  value={localState.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={loading}
                />
                )}
              </div>
              <div>
                <Label className="mb-2" htmlFor="description">Descripción</Label>
                {loading ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                <Textarea
                  id="description"
                  value={localState.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={loading}
                  rows={3}
                />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabla de productos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Productos ({localState.items.length})</CardTitle>
                <Button onClick={handleAddProduct} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir producto
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-center">Precio</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    // Skeletons para la tabla
                    [1, 2].map((i) => (
                      <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-12 h-12 rounded-md" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-4 w-16 mx-auto" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-8 w-20 mx-auto" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-4 w-16 mx-auto" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-8 w-8 mx-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <>
                    {localState.items.length > 0 && localState.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-left">
                        <div className="flex items-center gap-3 py-2">
                          <img
                            src={item.product.media[0]?.url}
                            alt={item.product.media[0]?.alt || item.product.title}
                            className="w-auto h-20 rounded-md object-cover"
                          />
                          <div>
                            <p className="font-medium">{item.product.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.variant.attributes.map(attr => `${attr.name}: ${attr.value}`).join(', ')}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                        <TableCell className="text-center">
                        {formatPrice(item.variant.price)}
                      </TableCell>
                        <TableCell className="text-center">
                        <Input
                          type="number"
                          min="1"
                            inputMode="numeric"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                            className="w-15 text-center"
                          disabled={loading}
                        />
                      </TableCell>
                        <TableCell className="text-center font-medium">
                        {formatPrice(item.variant.price * item.quantity)}
                      </TableCell>
                        <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveItem(index)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                    {localState.items.length === 0 && (
                      <TableRow className="bg-muted/50 h-50">
                        <TableCell colSpan={5} className="text-center">
                          <p className="text-muted-foreground mb-4">No hay productos en el enlace de pago</p>
                          <Button onClick={handleAddProduct} size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Añadir producto
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}

                    </>
                  )}
                </TableBody>
                {localState.items.length > 0 && (
                <TableFooter>
                      <TableRow>
                      <TableCell colSpan={3} className="text-right">
                          {localState.items.reduce( (access, item) => access + item.quantity, 0)} productos
                        </TableCell>
                        <TableCell colSpan={4} className="text-right">
                          {formatPrice(localState.items.reduce((acc, item) => acc + (item.variant ? (item.variant.price * item.quantity) : (item.product.price * item.quantity)), 0))}
                        </TableCell>
                        <TableCell colSpan={5} className="text-right"></TableCell>
                      </TableRow>
                    </TableFooter>
                   ) }
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Lado derecho - Configuraciones */}
        <div className="xl:col-span-1 sticky top-4 self-start space-y-6">
              {!isNew && (
<>
<Card className="mb-6">
                <CardContent>
                  <div className="text-sm flex h-8 items-center justify-start text-sm gap-6">
                    <div className="grow-1">
                      <Label className="mb-2" htmlFor="created_at">Fecha de creación</Label>
                      {loading ? (
                        <Skeleton className="h-4 w-32" />
                      ) : (
                        <div className="text-muted-foreground">
                          {new Date(paymentLink?.created_at || '').toLocaleDateString('es-ES')}
                        </div>
                      )}
                    </div>
                    <Separator orientation="vertical" />
                    <div className="grow-1">
                      <Label className="mb-2" htmlFor="updated_at">Última actualización</Label>
                      {loading ? (
                        <Skeleton className="h-4 w-32" />
                      ) : (
                        <div className="text-muted-foreground">
                          {new Date(paymentLink?.updated_at || '').toLocaleDateString('es-ES')}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <div className="text-sm flex h-6 items-center justify-start text-sm gap-6">
                    <div className="grow-1">
                      {loading ? (
                        <Skeleton className="h-4 w-48" />
                      ) : (
                        <span className="text-muted-foreground">https://payment.botivent.com/{paymentLink?.public_id}</span>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => {
                      navigator.clipboard.writeText(`https://payment.botivent.com/${paymentLink?.public_id}`)
                      toast.success("Enlace copiado")
                    }}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </>
            )}

             <Card className="mb-6">
            <CardContent className="text-sm flex items-center justify-start text-sm gap-6">
                    <div className="w-2/3">
                    <Label className="mb-2 w-full text-left" htmlFor="date">Fecha de expiración</Label> 
                     {loading ? (
                  <Skeleton className="h-10 w-full" />
                      ) : (
                  <Calendar22 label="Fecha de expiración" value={date ?? undefined} onChange={(date) => setDate(date ?? null)} open={openDatePicker} setOpen={setOpenDatePicker} />
                      )}
                    </div>
                    <div className="w-1/3">
                      <Label className="mb-2" htmlFor="max_uses">Límite de usos</Label>
                      {loading ? (
                  <Skeleton className="h-10 w-full" />
                      ) : (
                  <Input type="number" value={localState.max_uses || ""} onChange={(e) => handleInputChange('max_uses', e.target.value)} disabled={loading} />
                      )}
                    </div>
                </CardContent>
              </Card>

          <Card>
            <CardContent className="space-y-4">
              {/* Estado activo/inactivo */}
              {loading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
              <Label className="hover:bg-accent/50 h-20 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                <Checkbox
                  id="is_active"
                  checked={localState.is_active}
                  onCheckedChange={(checked) => handleToggle('is_active', checked as boolean)}
                  disabled={loading}
                  className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                />
                <div className="grid gap-1.5 font-normal">
                  <p className="text-sm leading-none font-medium">
                    Enlace activo
                  </p>
                  <p className="text-muted-foreground text-sm">
                    El enlace estará disponible para ser usado por los clientes.
                  </p>
                </div>
              </Label>
              )}
              {/* Dirección de envío requerida */}
              {loading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
              <Label className="hover:bg-accent/50 h-20 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                <Checkbox
                  id="is_shipping_address_required"
                  checked={localState.is_shipping_address_required}
                  onCheckedChange={(checked) => handleToggle('is_shipping_address_required', checked as boolean)}
                  disabled={loading}
                  className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                />
                <div className="grid gap-1.5 font-normal">
                  <p className="text-sm leading-none font-medium">
                    Dirección de envío requerida
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Los clientes deberán proporcionar su dirección de envío.
                  </p>
                </div>
              </Label>
              )}

              {/* Dirección de facturación requerida */}
              {loading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
              <Label className="hover:bg-accent/50 h-20 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                <Checkbox
                  id="is_billing_address_required"
                  checked={localState.is_billing_address_required}
                  onCheckedChange={(checked) => handleToggle('is_billing_address_required', checked as boolean)}
                  disabled={loading}
                  className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                />
                <div className="grid gap-1.5 font-normal">
                  <p className="text-sm leading-none font-medium">
                    Dirección de facturación requerida
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Los clientes deberán proporcionar su dirección de facturación.
                  </p>
                </div>
              </Label>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal para añadir productos */}
      <AddProductModal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onAddProducts={handleAddProducts}
        existingItems={localState.items}
      />
    </div>
  )
}
