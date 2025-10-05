"use client"

import { Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { VariantManager } from "@/components/features/products/variant-manager"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Attribute, Variant } from "@/lib/types"
import { useBreadcrumbsPage } from "@/hooks/use-breadcrumbs"
interface ProductViewProps {
  product: any
  loading: boolean
  actionButton?: React.ReactNode // botón externo arriba a la derecha
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
}

export function ProductView({ product, loading, actionButton }: ProductViewProps) {

    useBreadcrumbsPage([
        { path: "/panel", name: "Panel" },
        { path: "/panel/tienda", name: "Tienda" },
        { path: "/panel/tienda/productos", name: "Productos" },
        { path: `/panel/tienda/productos/${product.id}`, name: product.title }
      ])

  if (!product && !loading) {
    return <div className="p-6 text-center text-muted-foreground">Producto no encontrado</div>
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {loading ? (
            <Skeleton className="h-8 w-48" />
          ) : (
            <h1 className="text-2xl font-bold">{product.title}</h1>
          )}
        </div>

        {/* Botón externo */}
        {actionButton && <div>{actionButton}</div>}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* IZQUIERDA: Imágenes */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Imágenes del Producto</h3>
            {loading ? (
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="aspect-square w-full" />
                ))}
              </div>
            ) : product.media && product.media.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {product.media.map((image: any, index: number) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full rounded-lg border"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No hay imágenes</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* DERECHA: Información Básica */}
        <div className="space-y-6">
          {/* Fechas */}
          <Card className="mb-6">
            <CardContent>
              <div className="text-sm flex h-6 items-center justify-start text-sm gap-6">
                <div className="grow-1">
                  <div className="font-medium">Fecha de creación</div>
                  {loading ? (
                    <Skeleton className="h-4 w-32" />
                  ) : (
                    <div className="text-muted-foreground">
                      {formatDate(product.created_at)}
                    </div>
                  )}
                </div>
                <Separator orientation="vertical" />
                <div className="grow-1">
                  <div className="font-medium">Última actualización</div>
                  {loading ? (
                    <Skeleton className="h-4 w-32" />
                  ) : (
                    <div className="text-muted-foreground">
                      {formatDate(product.updated_at)}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                {loading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Input id="title" value={product.title} readOnly />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                {loading ? (
                  <Skeleton className="h-24 w-full" />
                ) : (
                  <Textarea
                    id="description"
                    value={product.description}
                    readOnly
                    rows={4}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Precio</Label>
                {loading ? (
                  <Skeleton className="h-10 w-32" />
                ) : (
                  <Input
                    id="price"
                    type="number"
                    value={(product.price / 100).toFixed(2)}
                    readOnly
                  />
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                {loading ? (
                  <Skeleton className="h-6 w-10" />
                ) : (
                  <>
                    <Switch id="is-public" checked={product.is_public} disabled />
                    <Label htmlFor="is-public">
                      {product.is_public ? "Público" : "Privado"}
                    </Label>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Variantes */}
          <Card>
            <CardHeader>
              <CardTitle>Variantes</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : (
                <VariantManager
                  showAttributeForm={false}
                  setShowAttributeForm={() => {}}
                  attributes={product.attributes as unknown as Attribute["row"][] || []}
                  variants={product.variants as unknown as Variant["row"][] || []}
                  onAttributesChange={() => {}}
                  onVariantsChange={() => {}}
                  readOnly={true} // 👈 Añade este prop en VariantManager para bloquear edición
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
