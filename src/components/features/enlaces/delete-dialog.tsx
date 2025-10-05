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
import { paymentLinksController } from "@/controllers"
import { toast } from "sonner"

interface DeleteDialogProps {
  enlace: {
    id: string
    title: string
  } | null
  onClose: () => void
  onSuccessDelete: () => void
}

export function DeleteDialog({ enlace, onClose, onSuccessDelete }: DeleteDialogProps) {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!enlace) return

    try {
      setDeleting(true)
      await paymentLinksController.deletePaymentLink(enlace.id)
      toast.success("Enlace de pago eliminado correctamente")
      router.push("/panel/tienda/enlaces-de-pago")
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
    <AlertDialog open={!!enlace} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar enlace de pago?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el enlace de pago{" "}
            <span className="font-semibold">"{enlace?.title}"</span> y todos sus datos asociados.
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
