"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Save, X } from "lucide-react"
import { FaSms } from "react-icons/fa"
import { toast } from "sonner"
import { integrationsController } from "@/controllers/integrationsController"

interface SMSTwilioModalProps {
  integration: any
  integrationId: string
  isOpen: boolean
  onClose: () => void
}

export function SMSTwilioModal({ integration, integrationId, isOpen, onClose }: SMSTwilioModalProps) {
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    account_sid: '',
    auth_token: '',
    phone_number: '',
    webhook_url: ''
  })

  useEffect(() => {
    if (integration?.userData) {
      setFormData({
        account_sid: '',
        auth_token: '',
        phone_number: '',
        webhook_url: ''
      })
    } else {
      setFormData({
        account_sid: '',
        auth_token: '',
        phone_number: '',
        webhook_url: ''
      })
    }
  }, [integration])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!formData.account_sid || !formData.auth_token || !formData.phone_number) {
      toast.error("Por favor completa todos los campos obligatorios")
      return
    }

    try {
      setSaving(true)
      
      if (integration?.userData) {
        const result = await integrationsController.updateIntegration(integration.userData.id, {
          provider: 'sms_twilio',
          display_name: integration.display_name,
          status: 'disconnected',
          config: formData
        })

        if (result instanceof Error) {
          toast.error("Error al actualizar la configuración")
          return
        }

        toast.success("Configuración de SMS Twilio actualizada correctamente")
      } else {
        const result = await integrationsController.createIntegration({
          provider: 'sms_twilio',
          display_name: integration?.display_name || 'SMS Twilio',
          status: 'disconnected',
          config: formData
        })

        if (result instanceof Error) {
          toast.error("Error al crear la integración")
          return
        }

        toast.success("Integración de SMS Twilio creada correctamente")
      }
      
      onClose()
    } catch (error) {
      console.error("Error saving SMS Twilio config:", error)
      toast.error("Error al guardar la configuración")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: '#F22F46' }}>
              <FaSms size={20} />
            </div>
            <div>
              <DialogTitle>
                {integration?.userData ? 'Configurar SMS Twilio' : 'Nueva Integración - SMS Twilio'}
              </DialogTitle>
              <DialogDescription>
                {integration?.userData 
                  ? 'Modifica la configuración de tu integración con Twilio SMS'
                  : 'Configura tu nueva integración con Twilio SMS'
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="account_sid" className="text-sm font-medium">
              Account SID *
            </Label>
            <Input
              id="account_sid"
              value={formData.account_sid}
              onChange={(e) => handleInputChange('account_sid', e.target.value)}
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground">
              SID de tu cuenta de Twilio
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="auth_token" className="text-sm font-medium">
              Auth Token *
            </Label>
            <Input
              id="auth_token"
              type="password"
              value={formData.auth_token}
              onChange={(e) => handleInputChange('auth_token', e.target.value)}
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              disabled={saving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number" className="text-sm font-medium">
              Número de Teléfono *
            </Label>
            <Input
              id="phone_number"
              value={formData.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              placeholder="+1234567890"
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground">
              Número de teléfono de Twilio para enviar SMS
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook_url" className="text-sm font-medium">
              Webhook URL
            </Label>
            <Input
              id="webhook_url"
              value={formData.webhook_url}
              onChange={(e) => handleInputChange('webhook_url', e.target.value)}
              placeholder="https://tu-dominio.com/webhook/twilio"
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground">
              URL para recibir notificaciones de estado (opcional)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !formData.account_sid || !formData.auth_token || !formData.phone_number}
          >
            {saving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {integration?.userData ? 'Actualizar Configuración' : 'Crear Integración'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
