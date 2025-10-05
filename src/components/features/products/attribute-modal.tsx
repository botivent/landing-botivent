"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { InputRow } from "@/components/ui/Forms/InputRow"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface AttributeModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: { name: string; values: string[] }) => void
  initialData?: {
    name: string
    values: string[]
  }
}

export function AttributeModal({
  open,
  onClose,
  onSave,
  initialData
}: AttributeModalProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [values, setValues] = useState(initialData?.values.join(", ") || "")

  const handleSave = () => {
    if (!name.trim() || !values.trim()) return

    const valuesList = values
      .split(",")
      .map(v => v.trim())
      .filter(v => v.length > 0)

    onSave({
      name: name.trim(),
      values: valuesList
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Atributo" : "Nuevo Atributo"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <InputRow
            label="Nombre del Atributo"
            placeholder="ej., Talla, Color, Material"
            name="attributeName"
            props={{
              value: name,
              onChange: (e) => setName(e.target.value)
            }}
          />
          <InputRow
            label="Valores (separados por comas)"
            placeholder="ej., S, M, L o Rojo, Azul, Verde"
            name="attributeValues"
            props={{
              value: values,
              onChange: (e) => setValues(e.target.value)
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {initialData ? "Guardar Cambios" : "Añadir Atributo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
