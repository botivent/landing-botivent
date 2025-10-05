"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

interface Integration {
  id: string
  provider: string
  display_name: string
  status: string
}

interface CredentialFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<void>
  title: string
  integration?: Integration | null
  credential?: any
}

const getProviderFields = (provider: string) => {
  switch (provider) {
    case 'whatsapp_meta':
      return [
        { key: 'phone_number_id', label: 'Phone Number ID', type: 'text', required: true },
        { key: 'permanent_token', label: 'Permanent Token', type: 'text', required: true }
      ]
    case 'facebook_messenger':
      return [
        { key: 'page_id', label: 'Page ID', type: 'text', required: true },
        { key: 'page_access_token', label: 'Page Access Token', type: 'text', required: true }
      ]
    case 'instagram_meta':
      return [
        { key: 'page_id', label: 'Page ID', type: 'text', required: true },
        { key: 'instagram_business_account_id', label: 'Instagram Business Account ID', type: 'text', required: true },
        { key: 'token', label: 'Token', type: 'text', required: true }
      ]
    case 'telegram_bot':
      return [
        { key: 'bot_token', label: 'Bot Token', type: 'text', required: true }
      ]
    case 'sms_twilio':
      return [
        { key: 'account_sid', label: 'Account SID', type: 'text', required: true },
        { key: 'auth_token', label: 'Auth Token', type: 'text', required: true },
        { key: 'from_number', label: 'From Number', type: 'text', required: true }
      ]
    default:
      return []
  }
}

export function CredentialForm({ 
  open, 
  onOpenChange, 
  onSubmit, 
  title, 
  integration,
  credential 
}: CredentialFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    ...getProviderFields(integration?.provider || '').reduce((acc, field) => {
      acc[field.key] = ''
      return acc
    }, {} as any)
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (credential) {
      // Edit mode - populate form with existing data
      setFormData({
        title: credential.title || '',
        ...getProviderFields(integration?.provider || '').reduce((acc, field) => {
          const providerData = credential[integration?.provider?.split('_')[0]] || {}
          acc[field.key] = providerData[field.key] || ''
          return acc
        }, {} as any)
      })
    } else {
      // Create mode - reset form
      setFormData({
        title: '',
        ...getProviderFields(integration?.provider || '').reduce((acc, field) => {
          acc[field.key] = ''
          return acc
        }, {} as any)
      })
    }
  }, [credential, integration, open])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!integration) {
      toast.error("Error: No se encontró la integración")
      return
    }

    try {
      setIsSubmitting(true)
      
      // Prepare the data structure based on provider
      const providerKey = integration.provider.split('_')[0] // whatsapp, facebook, etc.
      const providerData = getProviderFields(integration.provider).reduce((acc, field) => {
        acc[field.key] = formData[field.key]
        return acc
      }, {} as any)

      const submitData = {
        title: formData.title,
        integration_id: integration.id,
        [providerKey]: providerData
      }

      await onSubmit(submitData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Error al guardar la credencial")
    } finally {
      setIsSubmitting(false)
    }
  }

  const providerFields = integration ? getProviderFields(integration.provider) : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Nombre de la credencial</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ej: Credencial principal"
              required
              disabled={isSubmitting}
            />
          </div>

          {providerFields.map((field) => (
            <div key={field.key}>
              <Label htmlFor={field.key}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.key}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  placeholder={`Ingresa ${field.label.toLowerCase()}`}
                  required={field.required}
                  disabled={isSubmitting}
                  rows={3}
                />
              ) : (
                <Input
                  id={field.key}
                  type={field.type}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  placeholder={`Ingresa ${field.label.toLowerCase()}`}
                  required={field.required}
                  disabled={isSubmitting}
                />
              )}
            </div>
          ))}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : credential ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
