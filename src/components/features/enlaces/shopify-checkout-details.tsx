"use client"

import { useState, useEffect, useMemo } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Copy, Loader2, Plus, Save, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Calendar22 } from "@/components/ui/date-picker"
import { useBreadcrumbsPage } from "@/hooks/use-breadcrumbs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { productsController } from "@/controllers/productsController"
import { AddProductModal } from "./payment-link-details"

interface ShopifyCheckoutDetailsProps {
  isNew?: boolean
  checkout: {
    id?: string
    store_id: string
    checkout_url?: string
    product_ids: { id: string; quantity: number }[]
    total_price?: number
    currency?: string
    expires_at?: string | null
    created_at?: string
  } | null
  onSave: (products: any[]) => Promise<void>
  loading?: boolean
  isSaving?: boolean
}


export function ShopifyCheckoutDetails({ checkout, onSave, loading = false, isNew = false, isSaving = false }: ShopifyCheckoutDetailsProps) {
  const [items, setItems] = useState<any[]>(checkout?.product_ids || [])
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [date, setDate] = useState<Date | null>(checkout?.expires_at ? new Date(checkout.expires_at) : null)
  const [openCalendar, setOpenCalendar] = useState(false)
  useBreadcrumbsPage([
    { name: "Panel", path: "/panel" },
    { name: "Tienda", path: "/panel/tienda" },
    { name: "Checkouts Shopify", path: "/panel/tienda/shopify-checkouts" },
    { name: isNew ? "Nuevo Checkout" : checkout?.id || "Cargando...", path: "#" },
  ])

  const handleSave = async () => {
    if (items.length === 0) {
      toast.error("Debes añadir al menos un producto")
      return
    }
    await onSave(items)
    console.log("items")
    console.log(items)
  }

  const handleRemoveItem = (index: number) => {
    const updated = [...items]
    updated.splice(index, 1)
    setItems(updated)
  }

  const handleAddProducts = (newProducts: any[]) => {
    console.log("newProducts")
    console.log(newProducts)
    const updated = [...items, ...newProducts.map((p) => ({ product: p.product, variant: p.variant, quantity: 1 }))]
    setItems(updated)
  }

  const formatPrice = (price: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(price / 100)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {isNew ? "Nuevo Enlace de Pago | Shopify" : "Enlace de Pago | Shopify"}
        </h1>
        <Button onClick={handleSave} disabled={loading || isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {isNew ? "Crear Checkout" : "Guardar Cambios"}
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* IZQ */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Productos ({items.length})</CardTitle>
              <Button size="sm" onClick={() => setShowAddProductModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir producto
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                  <TableHead>Imagen</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-center">Precio</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [1, 2].map((i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="w-12 h-12 rounded-md" />
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
                  ) : items.length > 0 ? (
                    items.map((item, index) => {
                        console.log("item")
                        console.log(item)
                        return(
                      <TableRow key={index}>
                        <TableCell className="font-medium"><img src={item.product.media[0].url} alt={item.product.media[0].alt} className="w-12 h-12 rounded-md object-cover" /></TableCell>
                        <TableCell className="font-medium">{item.product.title} <br/> <span className="text-xs text-muted-foreground">{item.variant ? `(${item.variant.attributes.map((attr: any) => `${attr.name}: ${attr.value}`).join(', ')})` : ''}</span></TableCell>
                        <TableCell className="text-center">{formatPrice(item.variant ? item.variant.price : item.product.price.amount)}</TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const updated = [...items]
                              updated[index].quantity = parseInt(e.target.value) || 1
                              setItems(updated)
                            }}
                            className="w-16 text-center"
                          />
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {formatPrice((item.variant ? item.variant.price : item.product.price.amount) * item.quantity)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                
                )
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No hay productos añadidos.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>

                {items.length > 0 && (
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">
                        Total:
                      </TableCell>
                      <TableCell colSpan={2} className="text-right font-semibold">
                        {formatPrice(items.reduce((acc, i) => acc + (i.variant ? i.variant.price : i.product.price.amount) * i.quantity, 0))}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                )}
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* DERECHA */}
        <div className="xl:col-span-1 space-y-6">
          {!isNew && (
            <Card>
              <CardContent className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground truncate">
                  {checkout?.checkout_url}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(checkout?.checkout_url || "")
                    toast.success("Enlace copiado")
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent>
              <Label className="mb-2">Fecha de expiración</Label>
              {loading ? (
                <Skeleton className="h-10 w-full mt-2" />
              ) : (
                <Calendar22
                    setOpen={setOpenCalendar}
                    open={openCalendar}
                    label="Selecciona la fecha de expiración"
                  value={date ?? undefined}
                  onChange={(val) => setDate(val ?? null)}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AddProductModal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onAddProducts={handleAddProducts}
        existingItems={items}
      />
    </div>
  )
}
