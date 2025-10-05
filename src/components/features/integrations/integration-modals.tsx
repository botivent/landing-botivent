"use client"

import { useState } from "react"
import { WhatsAppModal } from "./modals/whatsapp-modal"
import { FacebookMessengerModal } from "./modals/facebook-messenger-modal"
import { InstagramModal } from "./modals/instagram-modal"
import { TelegramModal } from "./modals/telegram-modal"
import { SMSTwilioModal } from "./modals/sms-twilio-modal"

interface IntegrationModalsProps {
  integration: any
  integrationId: string
  isOpen: boolean
  onClose: () => void
}

export function IntegrationModals({ integration, integrationId, isOpen, onClose }: IntegrationModalsProps) {
  // Determinar qué modal mostrar basado en el provider
  const getModalComponent = () => {
    if (!integration) return null

    switch (integration.provider) {
      case 'whatsapp_meta':
        return (
          <WhatsAppModal
            integration={integration}
            integrationId={integrationId}
            isOpen={isOpen}
            onClose={onClose}
          />
        )
      case 'facebook_messenger':
        return (
          <FacebookMessengerModal
            integration={integration}
            integrationId={integrationId}
            isOpen={isOpen}
            onClose={onClose}
          />
        )
      case 'instagram_meta':
        return (
          <InstagramModal
            integration={integration}
            integrationId={integrationId}
            isOpen={isOpen}
            onClose={onClose}
          />
        )
      case 'telegram_bot':
        return (
          <TelegramModal
            integration={integration}
            integrationId={integrationId}
            isOpen={isOpen}
            onClose={onClose}
          />
        )
      case 'sms_twilio':
        return (
          <SMSTwilioModal
            integration={integration}
            integrationId={integrationId}
            isOpen={isOpen}
            onClose={onClose}
          />
        )
      default:
        return null
    }
  }

  return getModalComponent()
}
