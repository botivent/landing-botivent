/**
 * 
 * Componente para el formulario de credenciales.
 * 
 * @version 1.0.0
 * @since 2025-09-16
 * @author Gabriel Sanchez <gabriel@botivent.com>
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.open - Indica si el modal está abierto
 * 
 **/
'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { InputRow } from '@/components/ui/Forms/InputRow'

// Dynamic schema based on provider
const createCredentialSchema = (provider: string) => {
  const baseSchema = {
    title: z.string().min(1, 'El título es requerido').max(100, 'El título es demasiado largo'),
    is_active: z.boolean().optional(),
  }
  console.log('provider', provider)

  switch (provider) {
    case 'whatsapp_meta':
      return z.object({
        ...baseSchema,
        whatsapp: z
          .object({
            phone_number_id: z.string().optional(),
            permanent_token: z.string().optional(),
          })
          .optional(),
      })
    case 'facebook_messenger':
      return z.object({
        ...baseSchema,
        facebook: z
          .object({
            page_id: z.string().optional(),
            page_access_token: z.string().optional(),
          })
          .optional(),
      })
    case 'instagram_meta':
      return z.object({
        ...baseSchema,
        instagram: z
          .object({
            page_id: z.string().optional(),
            instagram_business_account_id: z.string().optional(),
            token: z.string().optional(),
          })
          .optional(),
      })
    case 'telegram_bot':
      return z.object({
        ...baseSchema,
        telegram: z.object({ bot_token: z.string().optional() }).optional(),
      })
    case 'sms_twilio':
      return z.object({
        ...baseSchema,
        twilio: z
          .object({
            account_sid: z.string().optional(),
            auth_token: z.string().optional(),
            from_number: z.string().optional(),
          })
          .optional(),
      })
    default:
      return z.object(baseSchema)
  }
}

type CredentialFormData = {
  title: string
  is_active?: boolean
  whatsapp?: {
    phone_number_id: string
    permanent_token: string
  }
  facebook?: {
    page_id: string
    page_access_token: string
  }
  instagram?: {
    page_id: string
    instagram_business_account_id: string
    token: string
  }
  telegram?: {
    bot_token: string
  }
  twilio?: {
    account_sid: string
    auth_token: string
    from_number: string
  }
}

interface CredentialFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CredentialFormData) => Promise<any>
  title: string
  integration?: any | null
  credential?: any | null
}

export function CredentialsForm({
  open,
  onOpenChange,
  onSubmit,
  title,
  credential,
  integration = null,
}: CredentialFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const schema = createCredentialSchema(
    integration?.provider  || '',
  )
  const form = useForm<CredentialFormData>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      title: '',
      is_active: true,
      whatsapp: {
        phone_number_id: '',
        permanent_token: '',
      },
      facebook: {
        page_id: '',
        page_access_token: '',
      },
      instagram: {
        page_id: '',
        instagram_business_account_id: '',
        token: '',
      },
      telegram: {
        bot_token: '',
      },
      twilio: {
        account_sid: '',
        auth_token: '',
        from_number: '',
      },
    },
  })

  useEffect(() => {
    console.log('credential', credential)
    if (credential) {
      form.reset({
        title: credential.title,
        is_active: Boolean(credential.is_active ?? true),

        // Mapeo seguro desde credential (puede no incluir sub-objetos)
        whatsapp: {
          phone_number_id: (credential as any)?.whatsapp?.phone_number_id || '',
          permanent_token: (credential as any)?.whatsapp?.permanent_token || '',
        },
        facebook: {
          page_id: (credential as any)?.facebook?.page_id || '',
          page_access_token: (credential as any)?.facebook?.page_access_token || '',
        },
        instagram: {
          page_id: (credential as any)?.instagram?.page_id || '',
          instagram_business_account_id: (credential as any)?.instagram?.instagram_business_account_id || '',
          token: (credential as any)?.instagram?.token || '',
        },
        telegram: {
          bot_token: (credential as any)?.telegram?.bot_token || '',
        },
        twilio: {
          account_sid: (credential as any)?.twilio?.account_sid || '',
          auth_token: (credential as any)?.twilio?.auth_token || '',
          from_number: (credential as any)?.twilio?.from_number || '',
        },
      })
    } else {
      form.reset({
        title: '',
        is_active: true,
        whatsapp: {
          phone_number_id: '',
          permanent_token: '',
        },
        facebook: {
          page_id: '',
          page_access_token: '',
        },
        instagram: {
          page_id: '',
          instagram_business_account_id: '',
          token: '',
        },
        telegram: {
          bot_token: '',
        },
        twilio: {
          account_sid: '',
          auth_token: '',
          from_number: '',
        },
      })
    }
  }, [credential, form, open])

  const handleSubmit = async (data: CredentialFormData) => {
    try {
      setIsSubmitting(true)

      // Validación explícita por provider (solo del bloque seleccionado)
      const provider = integration?.provider
      const require = (cond: boolean, msg: string) => {
        if (!cond) throw new Error(msg)
      }
      if (provider === 'whatsapp_meta') {
        require(!!data.whatsapp?.phone_number_id, 'Phone Number ID es requerido')
        require(!!data.whatsapp?.permanent_token, 'Permanent Token es requerido')
      }
      if (provider === 'facebook_messenger') {
        require(!!data.facebook?.page_id, 'Page ID es requerido')
        require(!!data.facebook?.page_access_token, 'Page Access Token es requerido')
      }
      if (provider === 'instagram_meta') {
        require(!!data.instagram?.page_id, 'Page ID es requerido')
        require(
          !!data.instagram?.instagram_business_account_id,
          'Instagram Business Account ID es requerido',
        )
        require(!!data.instagram?.token, 'Token es requerido')
      }
      if (provider === 'telegram_bot') {
        require(!!data.telegram?.bot_token, 'Bot Token es requerido')
      }
      if (provider === 'sms_twilio') {
        require(!!data.twilio?.account_sid, 'Account SID es requerido')
        require(!!data.twilio?.auth_token, 'Auth Token es requerido')
        require(!!data.twilio?.from_number, 'From Number es requerido')
      }

      // Keep only the selected provider block; others should be undefined
      // provider already defined
      const base: any = {
        title: data.title,
        is_active: data.is_active,
      }

      let payload: any = { ...base }

      switch (provider) {
        case 'whatsapp_meta': {
          payload.whatsapp = {
            phone_number_id: data.whatsapp?.phone_number_id || '',
            permanent_token: data.whatsapp?.permanent_token || '',
          }
          break
        }
        case 'facebook_messenger': {
          payload.facebook = {
            page_id: data.facebook?.page_id || '',
            page_access_token: data.facebook?.page_access_token || '',
          }
          break
        }
        case 'instagram_meta': {
          payload.instagram = {
            page_id: data.instagram?.page_id || '',
            instagram_business_account_id: data.instagram?.instagram_business_account_id || '',
            token: data.instagram?.token || '',
          }
          break
        }
        case 'telegram_bot': {
          payload.telegram = {
            bot_token: data.telegram?.bot_token || '',
          }
          break
        }
        case 'sms_twilio': {
          payload.twilio = {
            account_sid: data.twilio?.account_sid || '',
            auth_token: data.twilio?.auth_token || '',
            from_number: data.twilio?.from_number || '',
          }
          break
        }
        default: {
          // No provider, fallback to data as-is
          payload = { ...data }
        }
      }

      await onSubmit(payload)
      onOpenChange(false)
      form.reset()
    } catch (error: any) {
      // Mostrar error de validación simple
      if (error?.message) {
        // Usa tu sistema de toasts si lo tienes importado en este archivo
        // toast.error(error.message)
        console.error('Validation error:', error.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderProviderFields = () => {
    switch (integration?.provider) {
      case 'whatsapp_meta':
        return (
          <>
            <InputRow
              label="Phone Number ID"
              name="whatsapp.phone_number_id"
              placeholder="123456789"
              type="text"
              props={{
                value: form.watch('whatsapp.phone_number_id') || '',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  form.setValue('whatsapp.phone_number_id', e.target.value),
              }}
            />
            <InputRow
              label="Permanent Token"
              name="whatsapp.permanent_token"
              placeholder="EAA..."
              type="password"
              props={{
                value: form.watch('whatsapp.permanent_token') || '',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  form.setValue('whatsapp.permanent_token', e.target.value),
              }}
            />
          </>
        )

      case 'facebook_messenger':
        return (
          <>
            <InputRow
              label="Page ID"
              name="facebook.page_id"
              placeholder="123456789"
              type="text"
              props={{
                value: form.watch('facebook.page_id') || '',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  form.setValue('facebook.page_id', e.target.value),
              }}
            />
            <InputRow
              label="Page Access Token"
              name="facebook.page_access_token"
              placeholder="EAA..."
              type="password"
              props={{
                value: form.watch('facebook.page_access_token') || '',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  form.setValue('facebook.page_access_token', e.target.value),
              }}
            />
          </>
        )

      case 'instagram_meta':
        return (
          <>
            <InputRow
              label="Page ID"
              name="instagram.page_id"
              placeholder="123456789"
              type="text"
              props={{
                value: form.watch('instagram.page_id') || '',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  form.setValue('instagram.page_id', e.target.value),
              }}
            />
            <InputRow
              label="Instagram Business Account ID"
              name="instagram.instagram_business_account_id"
              placeholder="123456789"
              type="text"
              props={{
                value: form.watch('instagram.instagram_business_account_id') || '',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  form.setValue('instagram.instagram_business_account_id', e.target.value),
              }}
            />
            <InputRow
              label="Token"
              name="instagram.token"
              placeholder="EAA..."
              type="password"
              props={{
                value: form.watch('instagram.token') || '',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  form.setValue('instagram.token', e.target.value),
              }}
            />
          </>
        )

      case 'telegram_bot':
        return (
          <InputRow
            label="Bot Token"
            name="telegram.bot_token"
            placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
            type="password"
            props={{
              value: form.watch('telegram.bot_token') || '',
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                form.setValue('telegram.bot_token', e.target.value),
            }}
          />
        )

      case 'sms_twilio':
        return (
          <>
            <InputRow
              label="Account SID"
              name="twilio.account_sid"
              placeholder="AC..."
              type="text"
              props={{
                value: form.watch('twilio.account_sid') || '',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  form.setValue('twilio.account_sid', e.target.value),
              }}
            />
            <InputRow
              label="Auth Token"
              name="twilio.auth_token"
              placeholder="..."
              type="password"
              props={{
                value: form.watch('twilio.auth_token') || '',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  form.setValue('twilio.auth_token', e.target.value),
              }}
            />
            <InputRow
              label="From Number"
              name="twilio.from_number"
              placeholder="+1234567890"
              type="text"
              props={{
                value: form.watch('twilio.from_number') || '',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  form.setValue('twilio.from_number', e.target.value),
              }}
            />
          </>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título de la Credencial</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Credencial Principal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Credencial Activa</FormLabel>
                    <div className="text-sm text-gray-500">
                      Solo una credencial puede estar activa por integración
                    </div>
                  </div>
                  <FormControl>
                    <Switch checked={Boolean(field.value)} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {renderProviderFields()}

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
        </Form>
      </DialogContent>
    </Dialog>
  )
}
