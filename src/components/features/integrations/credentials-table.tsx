"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { MoreHorizontal, Copy, Edit, Trash2, Check, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

interface Credential {
  id: string
  integration_id: {
    id: string
    provider: string
    display_name: string
    status: string
  }
  title: string
  is_active: boolean
  created_at: string
  facebook: any
  telegram: any
  instagram: any
  twilio: any
  whatsapp: any
}

interface CredentialsTableProps {
  credentials: Credential[]
  loading: boolean
  integrationId: string
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getCredentialFields = (credential: Credential) => {
  const fields: { label: string; value: string | undefined }[] = []

  switch (credential.integration_id.provider) {
    case 'whatsapp_meta':
      if (credential.whatsapp?.phone_number_id)
        fields.push({ label: 'Phone Number ID', value: credential.whatsapp.phone_number_id })
      if (credential.whatsapp?.permanent_token)
        fields.push({ label: 'Permanent Token', value: credential.whatsapp.permanent_token })
      break
    case 'facebook_messenger':
      if (credential.facebook?.page_id) 
        fields.push({ label: 'Page ID', value: credential.facebook.page_id })
      if (credential.facebook?.page_access_token)
        fields.push({ label: 'Page Access Token', value: credential.facebook.page_access_token })
      break
    case 'instagram_meta':
      if (credential.instagram?.page_id) 
        fields.push({ label: 'Page ID', value: credential.instagram.page_id })
      if (credential.instagram?.instagram_business_account_id)
        fields.push({ label: 'Instagram Business Account ID', value: credential.instagram.instagram_business_account_id })
      if (credential.instagram?.token) 
        fields.push({ label: 'Token', value: credential.instagram.token })
      break
    case 'telegram_bot':
      if (credential.telegram?.bot_token) 
        fields.push({ label: 'Bot Token', value: credential.telegram.bot_token })
      break
    case 'sms_twilio':
      if (credential.twilio?.account_sid)
        fields.push({ label: 'Account SID', value: credential.twilio.account_sid })
      if (credential.twilio?.auth_token) 
        fields.push({ label: 'Auth Token', value: credential.twilio.auth_token })
      if (credential.twilio?.from_number)
        fields.push({ label: 'From Number', value: credential.twilio.from_number })
      break
  }

  return fields
}

export function CredentialsTable({ credentials, loading, integrationId }: CredentialsTableProps) {
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copiado al portapapeles")
  }

  const handleContextMenuAction = (action: string, credential: Credential, e: React.MouseEvent) => {
    e.stopPropagation()
    
    switch (action) {
      case 'copy':
        navigator.clipboard.writeText(credential.id)
        toast.success("ID de credencial copiado")
        break
    }
  }

  return (
    <div className="space-y-4">
      {credentials.map((credential) => (
        <div key={credential.id} className="border rounded-lg p-4 bg-muted/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{credential.title}</h4>
              {credential.is_active && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Check className="mr-1 h-3 w-3" />
                  Activa
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleCopyToClipboard(credential.id)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar ID
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="space-y-2">
            {getCredentialFields(credential).map((field, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{field.label}:</span>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-xs font-mono max-w-[200px] truncate">
                    {field.value}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyToClipboard(field.value || '')}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 text-xs text-muted-foreground">
            Creado: {formatDate(credential.created_at)}
          </div>
        </div>
      ))}
    </div>
  )
}
