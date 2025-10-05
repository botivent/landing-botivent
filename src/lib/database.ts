export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bot_default_messages: {
        Row: {
          closing: string | null
          created_at: string
          fallback: string | null
          greeting: string | null
          id: string
          order_confirmation: string | null
          out_of_hours: string | null
          published: boolean | null
          tone: string | null
          typing_delays: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          closing?: string | null
          created_at?: string
          fallback?: string | null
          greeting?: string | null
          id?: string
          order_confirmation?: string | null
          out_of_hours?: string | null
          published?: boolean | null
          tone?: string | null
          typing_delays?: Json | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          closing?: string | null
          created_at?: string
          fallback?: string | null
          greeting?: string | null
          id?: string
          order_confirmation?: string | null
          out_of_hours?: string | null
          published?: boolean | null
          tone?: string | null
          typing_delays?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bot_default_messages_store_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "stores"
            referencedColumns: ["user_id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          link_bio_slug: string | null
          name: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string
          trial_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          link_bio_slug?: string | null
          name: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string
          trial_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          link_bio_slug?: string | null
          name?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string
          trial_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversation_flows: {
        Row: {
          behavior: Json
          created_at: string
          edges: Json
          files: Json
          id: string
          name: string
          nodes: Json
          published: boolean
          store_id: string
          trigger: Json
          updated_at: string
          versions: Json
        }
        Insert: {
          behavior?: Json
          created_at?: string
          edges?: Json
          files?: Json
          id?: string
          name?: string
          nodes?: Json
          published?: boolean
          store_id: string
          trigger?: Json
          updated_at?: string
          versions?: Json
        }
        Update: {
          behavior?: Json
          created_at?: string
          edges?: Json
          files?: Json
          id?: string
          name?: string
          nodes?: Json
          published?: boolean
          store_id?: string
          trigger?: Json
          updated_at?: string
          versions?: Json
        }
        Relationships: [
          {
            foreignKeyName: "conversation_flows_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["user_id"]
          },
        ]
      }
      credentials: {
        Row: {
          created_at: string | null
          id: string
          integration_id: string | null
          is_active: boolean | null
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          integration_id?: string | null
          is_active?: boolean | null
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          integration_id?: string | null
          is_active?: boolean | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "credentials_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      credentials_facebook: {
        Row: {
          credential_id: string
          page_access_token: string
          page_id: string
        }
        Insert: {
          credential_id: string
          page_access_token: string
          page_id: string
        }
        Update: {
          credential_id?: string
          page_access_token?: string
          page_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credentials_facebook_credential_id_fkey"
            columns: ["credential_id"]
            isOneToOne: true
            referencedRelation: "credentials"
            referencedColumns: ["id"]
          },
        ]
      }
      credentials_instagram: {
        Row: {
          credential_id: string
          instagram_business_account_id: string
          page_id: string
          token: string
        }
        Insert: {
          credential_id: string
          instagram_business_account_id: string
          page_id: string
          token: string
        }
        Update: {
          credential_id?: string
          instagram_business_account_id?: string
          page_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "credentials_instagram_credential_id_fkey"
            columns: ["credential_id"]
            isOneToOne: true
            referencedRelation: "credentials"
            referencedColumns: ["id"]
          },
        ]
      }
      credentials_telegram: {
        Row: {
          bot_token: string
          credential_id: string | null
        }
        Insert: {
          bot_token: string
          credential_id?: string | null
        }
        Update: {
          bot_token?: string
          credential_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credentials_telegram_credential_id_fkey"
            columns: ["credential_id"]
            isOneToOne: true
            referencedRelation: "credentials"
            referencedColumns: ["id"]
          },
        ]
      }
      credentials_twilio: {
        Row: {
          account_sid: string
          auth_token: string
          credential_id: string | null
          from_number: string
        }
        Insert: {
          account_sid: string
          auth_token: string
          credential_id?: string | null
          from_number: string
        }
        Update: {
          account_sid?: string
          auth_token?: string
          credential_id?: string | null
          from_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "credentials_twilio_credential_id_fkey"
            columns: ["credential_id"]
            isOneToOne: true
            referencedRelation: "credentials"
            referencedColumns: ["id"]
          },
        ]
      }
      credentials_whatsapp: {
        Row: {
          credential_id: string | null
          permanent_token: string
          phone_number_id: string
        }
        Insert: {
          credential_id?: string | null
          permanent_token: string
          phone_number_id: string
        }
        Update: {
          credential_id?: string | null
          permanent_token?: string
          phone_number_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credentials_whatsapp_credential_id_fkey"
            columns: ["credential_id"]
            isOneToOne: true
            referencedRelation: "credentials"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          created_at: string
          display_name: string
          id: string
          last_health_check: string | null
          provider: string
          status: string
          store_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: string
          last_health_check?: string | null
          provider: string
          status?: string
          store_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          last_health_check?: string | null
          provider?: string
          status?: string
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integrations_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["user_id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          priority: string
          read_at: string | null
          related_order: string | null
          target_type: string
          target_user: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          priority?: string
          read_at?: string | null
          related_order?: string | null
          target_type: string
          target_user?: string | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          priority?: string
          read_at?: string | null
          related_order?: string | null
          target_type?: string
          target_user?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_order_fkey"
            columns: ["related_order"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount_paid: number
          billing_address: Json | null
          created_at: string
          customer_email: string
          customer_name: string | null
          id: string
          items: Json
          paid_at: string | null
          shipping_address: Json | null
          status: string
          store_id: string
          stripe_account_id: string
          stripe_payment_intent_id: string
          updated_at: string
        }
        Insert: {
          amount_paid: number
          billing_address?: Json | null
          created_at?: string
          customer_email: string
          customer_name?: string | null
          id?: string
          items: Json
          paid_at?: string | null
          shipping_address?: Json | null
          status?: string
          store_id: string
          stripe_account_id: string
          stripe_payment_intent_id: string
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          billing_address?: Json | null
          created_at?: string
          customer_email?: string
          customer_name?: string | null
          id?: string
          items?: Json
          paid_at?: string | null
          shipping_address?: Json | null
          status?: string
          store_id?: string
          stripe_account_id?: string
          stripe_payment_intent_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["user_id"]
          },
        ]
      }
      payment_links: {
        Row: {
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          is_billing_address_required: boolean
          is_shipping_address_required: boolean
          items: Json
          max_uses: number
          name: string
          public_id: string
          store_id: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_billing_address_required?: boolean
          is_shipping_address_required?: boolean
          items: Json
          max_uses?: number
          name: string
          public_id: string
          store_id: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_billing_address_required?: boolean
          is_shipping_address_required?: boolean
          items?: Json
          max_uses?: number
          name?: string
          public_id?: string
          store_id?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "payment_links_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["user_id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt: string | null
          created_at: string
          id: string
          product_id: string
          sort_order: number
          url: string
        }
        Insert: {
          alt?: string | null
          created_at?: string
          id?: string
          product_id: string
          sort_order?: number
          url: string
        }
        Update: {
          alt?: string | null
          created_at?: string
          id?: string
          product_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          attributes: Json | null
          category_id: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          is_public: boolean
          price: number
          store_id: string
          stripe_price_id: string | null
          stripe_product_id: string | null
          title: string
          updated_at: string
          variants: Json | null
        }
        Insert: {
          attributes?: Json | null
          category_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          is_public?: boolean
          price: number
          store_id: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          title: string
          updated_at?: string
          variants?: Json | null
        }
        Update: {
          attributes?: Json | null
          category_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          is_public?: boolean
          price?: number
          store_id?: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          title?: string
          updated_at?: string
          variants?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["user_id"]
          },
        ]
      }
      stores: {
        Row: {
          access_token: string | null
          api_key: string | null
          api_password: string | null
          api_url: string | null
          base_url: string | null
          billing_address: string | null
          billing_city: string | null
          billing_company: string | null
          billing_country: string | null
          billing_postal_code: string | null
          billing_vat_number: string | null
          consumer_key: string | null
          consumer_secret: string | null
          is_public: boolean
          prestashop_api_key: string | null
          slug: string | null
          store_description: string | null
          store_domain: string | null
          store_name: string | null
          store_url: string | null
          stripe_account_id: string | null
          support_email: string | null
          type: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          api_key?: string | null
          api_password?: string | null
          api_url?: string | null
          base_url?: string | null
          billing_address?: string | null
          billing_city?: string | null
          billing_company?: string | null
          billing_country?: string | null
          billing_postal_code?: string | null
          billing_vat_number?: string | null
          consumer_key?: string | null
          consumer_secret?: string | null
          is_public?: boolean
          prestashop_api_key?: string | null
          slug?: string | null
          store_description?: string | null
          store_domain?: string | null
          store_name?: string | null
          store_url?: string | null
          stripe_account_id?: string | null
          support_email?: string | null
          type?: string
          user_id?: string
        }
        Update: {
          access_token?: string | null
          api_key?: string | null
          api_password?: string | null
          api_url?: string | null
          base_url?: string | null
          billing_address?: string | null
          billing_city?: string | null
          billing_company?: string | null
          billing_country?: string | null
          billing_postal_code?: string | null
          billing_vat_number?: string | null
          consumer_key?: string | null
          consumer_secret?: string | null
          is_public?: boolean
          prestashop_api_key?: string | null
          slug?: string | null
          store_description?: string | null
          store_domain?: string | null
          store_name?: string | null
          store_url?: string | null
          stripe_account_id?: string | null
          support_email?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      variant_attribute_values: {
        Row: {
          attribute_value_id: string
          variant_id: string
        }
        Insert: {
          attribute_value_id: string
          variant_id: string
        }
        Update: {
          attribute_value_id?: string
          variant_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      citext: {
        Args: { "": boolean } | { "": string } | { "": unknown }
        Returns: string
      }
      citext_hash: {
        Args: { "": string }
        Returns: number
      }
      citextin: {
        Args: { "": unknown }
        Returns: string
      }
      citextout: {
        Args: { "": string }
        Returns: unknown
      }
      citextrecv: {
        Args: { "": unknown }
        Returns: string
      }
      citextsend: {
        Args: { "": string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
