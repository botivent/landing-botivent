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
import { FaTelegram } from "react-icons/fa"
import { toast } from "sonner"
import { integrationsController } from "@/controllers/integrationsController"

interface TelegramModalProps {
  integration: any
  integrationId: string
  isOpen: boolean
  onClose: () => void
}

export function TelegramModal({ integration, integrationId, isOpen, onClose }: TelegramModalProps) {
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    bot_token: '',
    bot_username: '',
    webhook_url: '',
    webhook_secret: ''
  })

  useEffect(() => {
    if (integration?.userData) {
      setFormData({
        bot_token: '',
        bot_username: '',
        webhook_url: '',
        webhook_secret: ''
      })
    } else {
      setFormData({
        bot_token: '',
        bot_username: '',
        webhook_url: '',
        webhook_secret: ''
      })
    }
  }, [integration])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!formData.bot_token || !formData.bot_username) {
      toast.error("Por favor completa todos los campos obligatorios")
      return
    }

    try {
      setSaving(true)
      
      if (integration?.userData) {
        const result = await integrationsController.updateIntegration(integration.userData.id, {
          provider: 'telegram_bot',
          display_name: integration.display_name,
          status: 'disconnected',
          config: formData
        })

        if (result instanceof Error) {
          toast.error("Error al actualizar la configuración")
          return
        }

        toast.success("Configuración de Telegram actualizada correctamente")
      } else {
        const result = await integrationsController.createIntegration({
          provider: 'telegram_bot',
          display_name: integration?.display_name || 'Telegram Bot',
          status: 'disconnected',
          config: formData
        })

        if (result instanceof Error) {
          toast.error("Error al crear la integración")
          return
        }

        toast.success("Integración de Telegram creada correctamente")
      }
      
      onClose()
    } catch (error) {
      console.error("Error saving Telegram config:", error)
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
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: '#0088CC' }}>
              <FaTelegram size={20} />
            </div>
            <div>
              <DialogTitle>
                {integration?.userData ? 'Configurar Telegram Bot' : 'Nueva Integración - Telegram Bot'}
              </DialogTitle>
              <DialogDescription>
                {integration?.userData 
                  ? 'Modifica la configuración de tu integración con Telegram Bot API'
                  : 'Configura tu nueva integración con Telegram Bot API'
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="bot_token" className="text-sm font-medium">
              Bot Token *
            </Label>
            <Input
              id="bot_token"
              type="password"
              value={formData.bot_token}
              onChange={(e) => handleInputChange('bot_token', e.target.value)}
              placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground">
              Token de tu bot de Telegram obtenido de @BotFather
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot_username" className="text-sm font-medium">
              Bot Username *
            </Label>
            <Input
              id="bot_username"
              value={formData.bot_username}
              onChange={(e) => handleInputChange('bot_username', e.target.value)}
              placeholder="@mi_bot"
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground">
              Nombre de usuario de tu bot (con @)
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
              placeholder="https://tu-dominio.com/webhook/telegram"
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground">
              URL donde recibir las actualizaciones del bot (opcional)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook_secret" className="text-sm font-medium">
              Webhook Secret
            </Label>
            <Input
              id="webhook_secret"
              type="password"
              value={formData.webhook_secret}
              onChange={(e) => handleInputChange('webhook_secret', e.target.value)}
              placeholder="mi_secreto_webhook"
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground">
              Secreto para verificar webhooks (opcional)
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
            disabled={saving || !formData.bot_token || !formData.bot_username}
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
