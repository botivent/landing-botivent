"use client"

import { useState } from "react"
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
import { toast } from "sonner"

interface DeleteImageDialogProps {
  imageId: string | null
  imageName: string
  onClose: () => void
  onConfirm: (imageId: string) => Promise<void>
}

export function DeleteImageDialog({ 
  imageId, 
  imageName, 
  onClose, 
  onConfirm 
}: DeleteImageDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!imageId) return

    try {
      setIsDeleting(true)
      await onConfirm(imageId)
      onClose()
    } catch (error) {
      console.error("Error deleting image:", error)
      toast.error("Error al eliminar la imagen")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={!!imageId} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar imagen?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente la imagen{" "}
            <span className="font-semibold">"{imageName}"</span> del producto.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
