"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Save, Plus } from "lucide-react"
import { integrationsController } from "@/controllers/integrationsController"
import { toast } from "sonner"

const providerOptions = [
  {
    value: 'whatsapp_meta',
    label: 'WhatsApp Business',
    description: 'Conecta con WhatsApp Business API'
  },
  {
    value: 'facebook_messenger',
    label: 'Facebook Messenger',
    description: 'Conecta con Facebook Messenger'
  },
  {
    value: 'instagram_meta',
    label: 'Instagram',
    description: 'Conecta con Instagram Direct'
  },
  {
    value: 'telegram_bot',
    label: 'Telegram Bot',
    description: 'Conecta con Telegram Bot API'
  },
  {
    value: 'sms_twilio',
    label: 'SMS Twilio',
    description: 'Conecta con Twilio SMS'
  }
]

interface UserIntegration {
  id: string
  store_id: string
  provider: string
  display_name: string
  status: string
  last_health_check: string | null
  created_at: string
  updated_at: string
}

interface EditIntegrationDialogProps {
  integration: UserIntegration | null
  onIntegrationUpdated?: (integration: UserIntegration) => void
  onIntegrationCreated?: (integration: UserIntegration) => void
}

export function EditIntegrationDialog({ integration, onIntegrationUpdated, onIntegrationCreated }: EditIntegrationDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    provider: '',
    display_name: '',
    status: 'disconnected'
  })

  // Abrir el diálogo cuando se seleccione una integración
  useEffect(() => {
    if (integration !== null) {
      setFormData({
        provider: integration.provider,
        display_name: integration.display_name,
        status: integration.status
      })
      setOpen(true)
    }
  }, [integration])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!formData.provider || !formData.display_name.trim()) {
      toast.error("Por favor completa todos los campos")
      return
    }

    try {
      setSaving(true)
      
      if (integration) {
        // Actualizar integración existente
        const result = await integrationsController.updateIntegration(integration.id, {
          provider: formData.provider,
          display_name: formData.display_name.trim(),
          status: formData.status
        })

        if (result instanceof Error) {
          toast.error("Error al actualizar la integración")
          return
        }

        toast.success("Integración actualizada correctamente")
        
        // Callback para actualizar la lista
        if (onIntegrationUpdated) {
          onIntegrationUpdated(result.integration)
        }
      } else {
        // Crear nueva integración
        const result = await integrationsController.createIntegration({
          provider: formData.provider,
          display_name: formData.display_name.trim(),
          status: 'disconnected'
        })

        if (result instanceof Error) {
          toast.error("Error al crear la integración")
          return
        }

        toast.success("Integración creada correctamente")
        
        // Callback para actualizar la lista
        if (onIntegrationCreated) {
          onIntegrationCreated(result.integration)
        }
        
        // Redirigir a la página de la integración
        router.push(`/panel/bot/integraciones/${result.integration.id}`)
      }
      
      setOpen(false)
    } catch (error) {
      console.error("Error saving integration:", error)
      toast.error("Error al guardar la integración")
    } finally {
      setSaving(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {integration ? 'Editar Integración' : 'Nueva Integración'}
          </DialogTitle>
          <DialogDescription>
            {integration ? 'Modifica los datos de tu integración' : 'Configura una nueva integración'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Proveedor */}
          <div className="space-y-2">
            <Label htmlFor="provider" className="text-sm font-medium">
              Plataforma *
            </Label>
            <Select
              value={formData.provider}
              onValueChange={(value) => handleInputChange('provider', value)}
              disabled={!!integration} // No permitir cambiar el proveedor si ya existe
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una plataforma" />
              </SelectTrigger>
              <SelectContent>
                {providerOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nombre de la integración */}
          <div className="space-y-2">
            <Label htmlFor="display_name" className="text-sm font-medium">
              Nombre de la Integración *
            </Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) => handleInputChange('display_name', e.target.value)}
              placeholder="Ej: WhatsApp Principal"
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground">
              Este nombre te ayudará a identificar la integración
            </p>
          </div>

          {/* Estado - solo mostrar si es edición */}
          {integration && (
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Estado
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="connected">Activo</SelectItem>
                  <SelectItem value="disconnected">Inactivo</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !formData.provider || !formData.display_name.trim()}
          >
            {saving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {integration ? 'Guardando...' : 'Creando...'}
              </>
            ) : (
              <>
                {integration ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Integración
                  </>
                )}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
