"use client"

import { useState } from "react"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Save } from "lucide-react"
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

interface CreateIntegrationDialogProps {
  children: React.ReactNode
  onIntegrationCreated?: (integrationId: string) => void
}

export function CreateIntegrationDialog({ children, onIntegrationCreated }: CreateIntegrationDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    provider: '',
    display_name: ''
  })

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
      setOpen(false)
      
      // Reset form
      setFormData({
        provider: '',
        display_name: ''
      })

      // Callback para actualizar la lista
      if (onIntegrationCreated) {
        onIntegrationCreated(result.integration.id)
      }

      // Redirigir a la página de la integración
      router.push(`/panel/bot/integraciones/${result.integration.id}`)
    } catch (error) {
      console.error("Error creating integration:", error)
      toast.error("Error al crear la integración")
    } finally {
      setSaving(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setFormData({
        provider: '',
        display_name: ''
      })
    }
    setOpen(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nueva Integración</DialogTitle>
          <DialogDescription>
            Crea una nueva integración con una plataforma de mensajería
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
                Creando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Crear Integración
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
