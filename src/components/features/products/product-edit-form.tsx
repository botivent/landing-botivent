"use client"

import { Save, Plus, Trash2, Image as ImageIcon, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { VariantManager } from "@/components/features/products/variant-manager"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ImageUpload } from "./image-upload"
import { DeleteImageDialog } from "./delete-image-dialog"
import { toast } from "sonner"
import { useCallback, useEffect, useState } from "react"
import { Attribute, Variant } from "@/lib/types"
import { productsController } from "@/controllers"
import { useRouter } from "next/navigation"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useBreadcrumbsPage } from "@/hooks/use-breadcrumbs"
import { API_BASE_URL } from "@/lib/utils"

interface ProductEditFormProps {
  product: any
  loading: boolean
  isNew?: boolean
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
}

// Componente para cada imagen sortable
function SortableImage({ 
  image, 
  index, 
  onDelete
}: { 
  image: any, 
  index: number, 
  onDelete: (imageId: string, imageName: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(image.id, image.alt || image.filename || `Imagen ${index + 1}`)
  }

  const handleOpenInNewTab = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(image.url, '_blank')
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          ref={setNodeRef}
          style={style}
          className={`relative group ${isDragging ? 'opacity-50' : ''}`}
          {...attributes}
          {...listeners}
        >
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
          <Button
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleDeleteClick}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleOpenInNewTab}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Abrir en nueva pestaña
        </ContextMenuItem>
        <ContextMenuItem 
          onClick={() => onDelete(image.id, image.alt || image.filename || `Imagen ${index + 1}`)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar imagen
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

// Componente para el DragOverlay
function DragOverlayImage({ image, index }: { image: any, index: number }) {
  return (
    <div className="relative group">
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
  )
}

export function ProductEditForm({ product: initialProduct, loading, isNew = false }: ProductEditFormProps) {
  const router = useRouter()
  const [product, setProduct] = useState(initialProduct)
  const [originalProduct, setOriginalProduct] = useState(initialProduct)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [deleteImageDialog, setDeleteImageDialog] = useState<{
    isOpen: boolean
    imageId: string | null
    imageName: string
  }>({
    isOpen: false,
    imageId: null,
    imageName: ""
  })

  // Form states
  const [title, setTitle] = useState(initialProduct?.title || "")
  const [description, setDescription] = useState(initialProduct?.description || "")
  const [price, setPrice] = useState(initialProduct?.price ? (initialProduct.price / 100).toString() : "")
  const [isPublic, setIsPublic] = useState(initialProduct?.is_public || false)
  const [showAttributeForm, setShowAttributeForm] = useState(false)

  // DnD sensors
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Update states when product changes
  useEffect(() => {
    if (!loading && initialProduct) {
      setProduct(initialProduct)
      setOriginalProduct(JSON.parse(JSON.stringify(initialProduct)))
      setTitle(initialProduct.title || "")
      setDescription(initialProduct.description || "")
      setPrice((initialProduct.price / 100).toString())
      setIsPublic(initialProduct.is_public || false)
    }
  }, [initialProduct, loading])

  // Detectar cambios comparando con el producto original
  useEffect(() => {
    if (product && originalProduct) {
      const currentProduct = JSON.stringify(product)
      const original = JSON.stringify(originalProduct)
      setHasChanges(currentProduct !== original)
    }
  }, [product, originalProduct])

  const handleSave = async () => {
    if (!product || (!hasChanges && !isNew)) return

    try {
      setSaving(true)
      
      if (isNew) {
        // Crear nuevo producto
        const response = await productsController.createProduct({
          title,
          description,
          price: Math.round(parseFloat(price) * 100),
          is_public: isPublic,
          attributes: product.attributes as any,
          variants: product.variants as any
        })

        if (response && response.product) {
          toast.success("Producto creado correctamente")
          router.push(`/panel/tienda/productos/${response.product.id}`)
        }
      } else {
        // Actualizar producto existente
        const response = await productsController.updateProduct(product.id, {
          title,
          description,
          price: Math.round(parseFloat(price) * 100),
          is_public: isPublic,
          attributes: product.attributes as any,
          variants: product.variants as any
        })

        if (response && response.product) {
          setProduct(response.product)
          setOriginalProduct(JSON.parse(JSON.stringify(response.product)))
          setHasChanges(false)
          toast.success("Producto actualizado correctamente")
        }
      }
    } catch (error) {
      console.error("Error saving product:", error)
      toast.error(isNew ? "Error al crear el producto" : "Error al actualizar el producto")
    } finally {
      setSaving(false)
    }
  }

  const handleProductChange = useCallback((updatedProduct: Partial<typeof product>) => {
    setProduct(prev => prev ? { ...prev, ...updatedProduct } : null)
  }, [])

  const handleAttributesChange = useCallback(
    (attributes: Attribute['row'][]) => {
      if (product) {
        // Generar variantes automáticamente basadas en los atributos
        const generateVariants = (attrs: Attribute['row'][]): Variant['row'][] => {
          if (attrs.length === 0) return []

          // Generar todas las combinaciones posibles
          const combinations = attrs.reduce<string[][]>((acc, attr) => {
            const values = attr.values.map((v) => v)
            if (acc.length === 0) {
              return values.map((v) => [v])
            }
            return acc.flatMap((combo) => values.map((v) => [...combo, v]))
          }, [])

          // Crear variantes con las combinaciones
          return combinations.map((combo) => {
            const variantAttributes = attrs.map((attr, index) => ({
              name: attr.name,
              value: combo[index],
            }))

            return {
              attributes: variantAttributes,
              id: variantAttributes.map((attr) => attr.value).join('-') + '-' + product.id,
              price: product.price,
              stock: null,
              sku: '',
            }
          })
        }

        const newVariants = generateVariants(attributes)
        handleProductChange({ ...product, attributes, variants: newVariants })
      }
    },
    [product, handleProductChange],
  )

  const handleVariantsChange = useCallback(
    (variants: Variant['row'][]) => {
      if (product) {
        handleProductChange({ ...product, variants })
      }
    },
    [product, handleProductChange],
  )

  // Actualizar el estado product cuando cambian los campos
  const handleFieldChange = (field: string, value: any) => {
    if (!product) return

    const updatedProduct = { ...product, [field]: value }
    setProduct(updatedProduct)

    // Actualizar también los estados individuales
    switch (field) {
      case "title":
        setTitle(value)
        break
      case "description":
        setDescription(value)
        break
      case "price":
        setPrice(value)
        break
      case "is_public":
        setIsPublic(value)
        break
    }
  }

  // Manejar el inicio del drag
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  // Manejar el reordenamiento de imágenes
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    setActiveId(null)

    if (active.id !== over?.id) {
      const oldIndex = product.media.findIndex((item: any) => item.id === active.id)
      const newIndex = product.media.findIndex((item: any) => item.id === over?.id)

      const newMedia = arrayMove(product.media, oldIndex, newIndex)
      
      // Actualizar el sort_order de cada imagen
      const updatedMedia = newMedia.map((item: any, index: number) => ({
        ...item,
        sort_order: index
      }))

      console.log('Nuevo orden de imágenes:', updatedMedia.map((img: any) => ({ id: img.id, sort_order: img.sort_order })))
      
      handleProductChange({ ...product, media: updatedMedia })
    }
  }

  // Abrir dialog de eliminación
  const handleDeleteImage = (imageId: string, imageName: string) => {
    console.log('Opening delete dialog for:', imageId, imageName)
    setDeleteImageDialog({
      isOpen: true,
      imageId,
      imageName
    })
  }

  // Confirmar eliminación de imagen
  const handleConfirmDeleteImage = async (imageId: string) => {
    try {
      console.log('Deleting image:', imageId)
      // Aquí iría la llamada a la API para eliminar la imagen del servidor
      // Por ahora solo eliminamos del estado local
      const updatedMedia = product.media.filter((img: any) => img.id !== imageId)
      const response = await fetch(`${API_BASE_URL}/api/store/products/${product.id}/media/${imageId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Error al eliminar la imagen')
      }
      handleProductChange({ ...product, media: updatedMedia })
      
      toast.success("Imagen eliminada correctamente")
    } catch (error) {
      console.error("Error deleting image:", error)
      throw error // Re-lanzar para que el dialog maneje el error
    }
  }

  // Cerrar dialog de eliminación
  const handleCloseDeleteDialog = () => {
    setDeleteImageDialog({
      isOpen: false,
      imageId: null,
      imageName: ""
    })
  }

  // Manejar upload de imágenes
  const handleImageUpload = async () => {
    if (uploadFiles.length === 0) return

    try {
      setIsUploadingImages(true)
      
      if (uploadFiles.length > 10) {
        toast.error('Máximo 10 imágenes por subida')
        return
      }

      toast.info('Subiendo imágenes...', { position: 'bottom-left' })

      const formData = new FormData()
      // Importante: misma key 'files' para todos
      Array.from(uploadFiles).forEach((f) => formData.append('files', f))

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/store/products/${product.id}/media/upload`, {
        method: 'POST',
        body: formData, // NO pongas Content-Type; fetch lo añade con boundary
        credentials: 'include',
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Error al subir las imágenes')
      }

      const data = await res.json()
      // data.media es un array de { id, url, alt, filename }
      // y (opcional) data.product si devolviste el producto actualizado

      if (data.media && data.media.length > 0) {
        // Añadir las nuevas imágenes al producto
        const updatedMedia = [...product.media, ...data.media]
        handleProductChange({ ...product, media: updatedMedia })
        
        // Si el servidor devolvió el producto actualizado, usarlo
        if (data.product) {
          setProduct(data.product)
          setOriginalProduct(JSON.parse(JSON.stringify(data.product)))
        }
      }

      toast.success('¡Imágenes subidas correctamente!', { position: 'bottom-left' })
      
      setUploadFiles([])
      setIsImageModalOpen(false)
    } catch (error) {
      console.error('Error uploading images:', error)
      toast.error(error instanceof Error ? error.message : 'Error al subir las imágenes')
    } finally {
      setIsUploadingImages(false)
    }
  }

  useBreadcrumbsPage([
    { path: "/panel", name: "Panel" },
    { path: "/panel/tienda", name: "Tienda" },
    { path: "/panel/tienda/productos", name: "Productos" },
    { path: `/panel/tienda/productos/${product.id}`, name: product.title }
  ])

  // Encontrar la imagen activa para el DragOverlay
  const activeImage = activeId ? product.media.find((img: any) => img.id === activeId) : null
  const activeImageIndex = activeImage ? product.media.findIndex((img: any) => img.id === activeId) : -1

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {loading ? (
              <Skeleton className="h-8 w-48" />
            ) : isNew ? (
              <h1 className="text-2xl font-bold">Nuevo Producto</h1>
            ) : (
              <h1 className="text-2xl font-bold">{product.title}</h1>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {loading ? (
                <Skeleton className="h-6 w-10" />
              ) : (
                <>
                  <Switch
                    id="is-public"
                    checked={isPublic}
                    onCheckedChange={(checked) => handleFieldChange("is_public", checked)}
                  />
                  <Label htmlFor="is-public">
                    {isPublic ? "Público" : "Privado"}
                  </Label>
                </>
              )}
            </div>
            <Button 
              onClick={handleSave} 
              disabled={loading || saving || (!hasChanges && !isNew)}
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? (isNew ? "Creando..." : "Guardando...") : (isNew ? "Crear Producto" : "Guardar Cambios")}
            </Button>
          </div>
        </div>
      </div>


      <div className="grid gap-6 lg:grid-cols-2">
        {/* IZQUIERDA: Imágenes */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Imágenes del Producto</h3>
              <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" disabled={loading}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Gestionar Imágenes</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <ImageUpload
                      files={uploadFiles}
                      onFilesChange={setUploadFiles}
                      onSuccess={(files) => {
                        console.log('Files added:', files)
                      }}
                      onError={(error) => {
                        console.error('Upload error:', error)
                      }}
                      maxFiles={10}
                      maxSize={5}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsImageModalOpen(false)}
                        disabled={isUploadingImages}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleImageUpload}
                        disabled={uploadFiles.length === 0 || isUploadingImages}
                      >
                        {isUploadingImages ? 'Subiendo...' : 'Añadir Imágenes'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-4">
                {[1,2,3,4].map((i) => (
                  <Skeleton key={i} className="aspect-square w-full" />
                ))}
              </div>
            ) : product.media && product.media.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={product.media.map((img: any) => img.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-2 gap-4">
                    {product.media.map((image: any, index: number) => (
                      <SortableImage
                        key={image.id}
                        image={image}
                        index={index}
                        onDelete={handleDeleteImage}
                      />
                    ))}
                  </div>
                </SortableContext>
                
                <DragOverlay adjustScale style={{ transformOrigin: '0 0' }}>
                  {activeImage ? (
                    <DragOverlayImage 
                      image={activeImage} 
                      index={activeImageIndex} 
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            ) : (
              <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No hay imágenes</p>
                  <Button 
                    variant="outline"
                    onClick={() => setIsImageModalOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Añadir primera imagen
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* DERECHA: Información Básica */}
        <div className="space-y-6">
        {!isNew && (
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
      )}
          {/* Información Básica */}
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
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    placeholder="Nombre del producto"
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                {loading ? (
                  <Skeleton className="h-24 w-full" />
                ) : (
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                    placeholder="Descripción del producto"
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
                    step="0.01"
                    value={price}
                    onChange={(e) => handleFieldChange("price", e.target.value)}
                    placeholder="0.00"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Variantes */}
          <Card>
            <CardHeader>
              <CardTitle>
              <div className="flex items-center justify-between">
              <span>Variantes</span>
                    <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAttributeForm(true)}
                  className="h-8"
                >
                  <Plus className="w-4 h-4" />
                </Button>

              </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {loading ? (
                <div className="space-y-4">
                  {[1,2,3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : (
                <VariantManager
                  showAttributeForm={showAttributeForm}
                  setShowAttributeForm={setShowAttributeForm}
                  attributes={product?.attributes as unknown as Attribute['row'][] || []}
                  variants={product?.variants as unknown as Variant['row'][] || []}
                  onAttributesChange={handleAttributesChange}
                  onVariantsChange={handleVariantsChange}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Image Dialog */}
      <DeleteImageDialog
        imageId={deleteImageDialog.imageId}
        imageName={deleteImageDialog.imageName}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDeleteImage}
      />
    </div>
  )
}
