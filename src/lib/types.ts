import type { Database } from './database'

export type MediaFile = {
    insert: Database['public']['Tables']['product_images']['Insert']
    update: Database['public']['Tables']['product_images']['Update']
    row: Database['public']['Tables']['product_images']['Row']
}
export type Product = {
    insert: Database['public']['Tables']['products']['Insert']
    update: Database['public']['Tables']['products']['Update']
    row: Database['public']['Tables']['products']['Row']
}
export type Store = {
    insert: Database['public']['Tables']['stores']['Insert']
    update: Database['public']['Tables']['stores']['Update']
    row: Database['public']['Tables']['stores']['Row'] & {
        enabled: boolean
    }
}
export type User = {
    insert: {
        email: string
    }
    update: {
        email: string
    }
    row: {
        id: string
        email: string
    }
}
export type PaymentLink = {
    insert: Database['public']['Tables']['payment_links']['Insert']
    update: Database['public']['Tables']['payment_links']['Update']
    row: Database['public']['Tables']['payment_links']['Row'] & {
        items: {
            product: Product['row']
            variant?: Variant['row']
            quantity: number
        }[]
    }
}
export type BotDefaultMessage = {
    insert: Database['public']['Tables']['bot_default_messages']['Insert']
    update: Database['public']['Tables']['bot_default_messages']['Update']
    row: Database['public']['Tables']['bot_default_messages']['Row']
}
export type ConversationFlows = {
    insert: Database['public']['Tables']['conversation_flows']['Insert']
    update: Database['public']['Tables']['conversation_flows']['Update']
    row: Database['public']['Tables']['conversation_flows']['Row']
}
// Removed ConversationFlowsSteps: table does not exist in current schema
export type Clients = {
    insert: Database['public']['Tables']['clients']['Insert']
    update: Database['public']['Tables']['clients']['Update']
    row: Database['public']['Tables']['clients']['Row']
}
export type Credentials = {
    insert: Database['public']['Tables']['credentials']['Insert']
    update: Database['public']['Tables']['credentials']['Update']
    row: Database['public']['Tables']['credentials']['Row']
}
export type Integrations = {
    insert: Database['public']['Tables']['integrations']['Insert']
    update: Database['public']['Tables']['integrations']['Update']
    row: Database['public']['Tables']['integrations']['Row']
}
export type Notifications = {
    insert: Database['public']['Tables']['notifications']['Insert']
    update: Database['public']['Tables']['notifications']['Update']
    row: Database['public']['Tables']['notifications']['Row']
}
export type Orders = {
    insert: Database['public']['Tables']['orders']['Insert']
    update: Database['public']['Tables']['orders']['Update']
    row: Database['public']['Tables']['orders']['Row']
}
export type ProductImages = {
    insert: Database['public']['Tables']['product_images']['Insert']
    update: Database['public']['Tables']['product_images']['Update']
    row: Database['public']['Tables']['product_images']['Row']
}
export type ProductMedia = Product['row'] & {
    media?: ProductImages['row'][]
}
export type Attribute = {
    insert: {
        name: string
        values: string[]
    }
    update: {
        name: string
        values: string[]
    }
    row: {
        id: string
        name: string
        values: string[]
    }
}
export type Variant = {
    insert: {
        attributes: { name: string; value: string }[]
        price: number
        stock?: number
        sku?: string
        stripePriceId?: string
    }
    update: {
        attributes: { name: string; value: string }[]
        price: number
        stock?: number
        sku?: string
        stripePriceId?: string
    }
    row: {
        id: string
        attributes: { name: string; value: string }[]
        price: number
        stock?: number
        sku?: string
        stripePriceId?: string
    }
}