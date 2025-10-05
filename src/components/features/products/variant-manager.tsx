'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react'
import { InputRow } from '@/components/ui/Forms/InputRow'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Attribute, Variant } from '../../../lib/types'

interface VariantManagerProps {
  attributes: Attribute['row'][]
  variants: Variant['row'][]
  onAttributesChange: (attributes: Attribute['row'][]) => void
  onVariantsChange: (variants: Variant['row'][]) => void
  showAttributeForm: boolean
  setShowAttributeForm: (show: boolean) => void
  readOnly?: boolean // 👈 añadido
}

export function VariantManager({
  attributes,
  variants,
  onAttributesChange,
  onVariantsChange,
  showAttributeForm,
  setShowAttributeForm,
  readOnly = false, // 👈 valor por defecto
}: VariantManagerProps) {
  const [openVariants, setOpenVariants] = useState<Set<number>>(new Set())
  const [newAttributeName, setNewAttributeName] = useState('')
  const [newAttributeValues, setNewAttributeValues] = useState('')

  const addAttribute = () => {
    if (readOnly) return
    if (!newAttributeName.trim() || !newAttributeValues.trim()) return

    const values = newAttributeValues
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v.length > 0)

    const newAttribute = {
      name: newAttributeName.trim(),
      values,
    }

    const updatedAttributes = [...attributes, newAttribute]
    onAttributesChange(updatedAttributes)
    setNewAttributeName('')
    setNewAttributeValues('')
    setShowAttributeForm(false)
  }

  const removeAttribute = (index: number) => {
    if (readOnly) return
    const updatedAttributes = attributes.filter((_, i) => i !== index)
    onAttributesChange(updatedAttributes)
  }

  const updateVariant = (index: number, field: keyof Variant['row'], value: any) => {
    if (readOnly) return
    const updatedVariants = variants.map((variant, i) => {
      if (i === index) {
        return { ...variant, [field]: value }
      }
      return variant
    })
    onVariantsChange(updatedVariants)
  }

  const toggleVariant = (index: number) => {
    const newOpenVariants = new Set(openVariants)
    if (newOpenVariants.has(index)) {
      newOpenVariants.delete(index)
    } else {
      newOpenVariants.add(index)
    }
    setOpenVariants(newOpenVariants)
  }

  return (
    <div className="space-y-4">
      {/* Attributes Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm">Atributos</h4>
        </div>

        {attributes.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No hay atributos. Añade atributos para crear variantes automáticamente.
          </p>
        ) : (
          <div className="space-y-2">
            {attributes.map((attr, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm font-medium">{attr.name}:</span>
                <div className="flex flex-wrap gap-1">
                  {attr.values.map((value, valueIndex) => (
                    <span
                      key={valueIndex}
                      className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm"
                    >
                      {value}
                      {!readOnly && (
                        <button
                          type="button"
                          onClick={() => {
                            const updatedValues = attr.values.filter((_, i) => i !== valueIndex)
                            const updatedAttributes = attributes.map((a, i) =>
                              i === index ? { ...a, values: updatedValues } : a
                            )
                            onAttributesChange(updatedAttributes)
                          }}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {!readOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttribute(index)}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {!readOnly && (
          <Dialog open={showAttributeForm} onOpenChange={setShowAttributeForm}>
            <DialogContent>
              <DialogTitle>Añadir atributo</DialogTitle>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  addAttribute()
                }}
              >
                <InputRow
                  label="Nombre del atributo"
                  value={newAttributeName}
                  onChange={(e) => setNewAttributeName(e.target.value)}
                  placeholder="ej: Talla, Color, Material"
                />
                <InputRow
                  label="Valores (separados por comas)"
                  value={newAttributeValues}
                  onChange={(e) => setNewAttributeValues(e.target.value)}
                  placeholder="ej: S, M, L, XL"
                />
                <div className="flex gap-2">
                  <Button type="submit" size="sm">
                    Añadir
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAttributeForm(false)}
                    size="sm"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Variants Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm">Variantes ({variants.length})</h4>
        </div>

        {variants.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">
              No hay variantes. Añade atributos para generar variantes automáticamente.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {variants.map((variant, index) => (
              <Collapsible
                key={index}
                open={openVariants.has(index)}
                onOpenChange={() => toggleVariant(index)}
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {variant.attributes.map((attr, attrIndex) => (
                          <span
                            key={attrIndex}
                            className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs"
                          >
                            {attr.name}: {attr.value}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {openVariants.has(index) ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-3 border-t bg-muted/25 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <InputRow
                        label="Precio (€)"
                        type="number"
                        step="0.01"
                        value={variant.price ? (variant.price / 100).toString() : ''}
                        onChange={(e) => {
                          if (!readOnly) {
                            const price = parseFloat(e.target.value) || 0
                            updateVariant(index, 'price', Math.round(price * 100))
                          }
                        }}
                        readOnly={readOnly}
                      />
                      <InputRow
                        label="Stock"
                        type="number"
                        value={variant.stock !== null ? variant.stock.toString() : ''}
                        onChange={(e) => {
                          if (!readOnly) {
                            const value = e.target.value
                            if (value === '' || value === null || value === undefined) {
                              updateVariant(index, 'stock', null)
                            } else {
                              const stockValue = parseInt(value)
                              updateVariant(index, 'stock', isNaN(stockValue) ? null : stockValue)
                            }
                          }
                        }}
                        readOnly={readOnly}
                      />
                    </div>
                    <InputRow
                      label="SKU"
                      value={variant.sku || ''}
                      onChange={(e) => {
                        if (!readOnly) updateVariant(index, 'sku', e.target.value)
                      }}
                      readOnly={readOnly}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
