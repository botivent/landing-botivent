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
import { FaFacebookMessenger } from "react-icons/fa"
import { toast } from "sonner"
import { integrationsController } from "@/controllers/integrationsController"
import { API_BASE_URL } from "@/lib/utils"

interface FacebookMessengerModalProps {
  integration: any
  integrationId: string
  isOpen: boolean
  onClose: () => void
}

export function FacebookMessengerModal({ integration, integrationId, isOpen, onClose }: FacebookMessengerModalProps) {
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    page_id: '',
    access_token: '',
    app_secret: '',
    webhook_verify_token: ''
  })

  // Cargar datos existentes si la integración ya está configurada
  useEffect(() => {
    if (integration?.userData) {
      // Aquí cargarías los datos existentes de la integración
      setFormData({
        page_id: '',
        access_token: '',
        app_secret: '',
        webhook_verify_token: ''
      })
    } else {
      // Limpiar formulario para nueva integración
      setFormData({
        page_id: '',
        access_token: '',
        app_secret: '',
        webhook_verify_token: ''
      })
    }
  }, [integration])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleMetaAuth = () => {
    
    toast.info("Redirigiendo a Meta para autenticación...")
    window.open(`${API_BASE_URL}/api/integrations/meta/auth?provider=facebook_messenger`, '_blank')
  }

  const handleSave = async () => {
    if (!formData.page_id || !formData.access_token) {
      toast.error("Por favor completa todos los campos obligatorios")
      return
    }

    try {
      setSaving(true)
      
      if (integration?.userData) {
        // Actualizar integración existente
        const result = await integrationsController.updateIntegration(integration.userData.id, {
          provider: 'facebook_messenger',
          display_name: integration.display_name,
          status: 'disconnected',
          config: formData
        })

        if (result instanceof Error) {
          toast.error("Error al actualizar la configuración")
          return
        }

        toast.success("Configuración de Facebook Messenger actualizada correctamente")
      } else {
        // Crear nueva integración
        const result = await integrationsController.createIntegration({
          provider: 'facebook_messenger',
          display_name: integration?.display_name || 'Facebook Messenger',
          status: 'disconnected',
          config: formData
        })

        if (result instanceof Error) {
          toast.error("Error al crear la integración")
          return
        }

        toast.success("Integración de Facebook Messenger creada correctamente")
      }
      
      onClose()
    } catch (error) {
      console.error("Error saving Facebook Messenger config:", error)
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
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: '#0084FF' }}>
              <FaFacebookMessenger size={20} />
            </div>
            <div>
              <DialogTitle>
                {integration?.userData ? 'Configurar Facebook Messenger' : 'Nueva Integración - Facebook Messenger'}
              </DialogTitle>
              <DialogDescription>
                {integration?.userData 
                  ? 'Modifica la configuración de tu integración con Facebook Messenger'
                  : 'Configura tu nueva integración con Facebook Messenger'
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Botón de Auth con Meta */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Autenticación con Meta
            </Label>
            <Button variant="outline" type="button" className="w-full" onClick={handleMetaAuth}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                <path
                  d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                  fill="currentColor"
                />
              </svg>
              <span>Auth with Meta</span>
            </Button>
            <p className="text-xs text-muted-foreground">
              Autentica automáticamente con tu cuenta de Meta para obtener los tokens
            </p>
          </div>

          {/* Separador */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">O configura manualmente</span>
            </div>
          </div>

          {/* Page ID */}
          <div className="space-y-2">
            <Label htmlFor="page_id" className="text-sm font-medium">
              Page ID *
            </Label>
            <Input
              id="page_id"
              value={formData.page_id}
              onChange={(e) => handleInputChange('page_id', e.target.value)}
              placeholder="123456789012345"
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground">
              ID de tu página de Facebook
            </p>
          </div>

          {/* Access Token */}
          <div className="space-y-2">
            <Label htmlFor="access_token" className="text-sm font-medium">
              Access Token *
            </Label>
            <Input
              id="access_token"
              type="password"
              value={formData.access_token}
              onChange={(e) => handleInputChange('access_token', e.target.value)}
              placeholder="EAAxxxxxxxxxxxxx"
              disabled={saving}
            />
          </div>

          {/* App Secret */}
          <div className="space-y-2">
            <Label htmlFor="app_secret" className="text-sm font-medium">
              App Secret
            </Label>
            <Input
              id="app_secret"
              type="password"
              value={formData.app_secret}
              onChange={(e) => handleInputChange('app_secret', e.target.value)}
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground">
              Secreto de tu aplicación de Facebook (opcional)
            </p>
          </div>

          {/* Webhook Verify Token */}
          <div className="space-y-2">
            <Label htmlFor="webhook_verify_token" className="text-sm font-medium">
              Webhook Verify Token
            </Label>
            <Input
              id="webhook_verify_token"
              value={formData.webhook_verify_token}
              onChange={(e) => handleInputChange('webhook_verify_token', e.target.value)}
              placeholder="mi_token_secreto"
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground">
              Token para verificar webhooks (opcional)
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
            disabled={saving || !formData.page_id || !formData.access_token}
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
