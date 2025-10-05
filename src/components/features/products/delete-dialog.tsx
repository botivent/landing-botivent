"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { productsController } from "@/controllers"
import { toast } from "sonner"

interface DeleteDialogProps {
  product: {
    id: string
    title: string
  } | null
  onClose: () => void
  onSuccessDelete: () => void
}

export function DeleteDialog({ product, onClose, onSuccessDelete }: DeleteDialogProps) {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!product) return

    try {
      setDeleting(true)
      await productsController.deleteProduct(product.id)
      toast.success("Producto eliminado correctamente")
      router.push("/panel/tienda/productos")
      onSuccessDelete()
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Error al eliminar el producto")
    } finally {
      setDeleting(false)
      onClose()
    }
  }

  return (
    <AlertDialog open={!!product} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el producto{" "}
            <span className="font-semibold">"{product?.title}"</span> y todos sus datos asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
