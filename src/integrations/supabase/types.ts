export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: {
          created_at: string
          emails: Json | null
          files: Json | null
          id: string
          name: string
          notes: string | null
          phones: Json | null
          responsible_user_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          emails?: Json | null
          files?: Json | null
          id?: string
          name: string
          notes?: string | null
          phones?: Json | null
          responsible_user_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          emails?: Json | null
          files?: Json | null
          id?: string
          name?: string
          notes?: string | null
          phones?: Json | null
          responsible_user_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          comment: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          responsible_user_id: string | null
          source: string | null
          status: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          responsible_user_id?: string | null
          source?: string | null
          status?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          responsible_user_id?: string | null
          source?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          related_id: string | null
          related_table: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          related_id?: string | null
          related_table?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          related_id?: string | null
          related_table?: string | null
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          addresses: Json | null
          amount: number
          associated_supplier_id: string | null
          client_id: string
          created_at: string
          files: Json | null
          id: string
          items: Json | null
          notes: string | null
          order_number: string
          order_type: string
          partner_id: string | null
          payment_status: string | null
          responsible_user_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          addresses?: Json | null
          amount?: number
          associated_supplier_id?: string | null
          client_id: string
          created_at?: string
          files?: Json | null
          id?: string
          items?: Json | null
          notes?: string | null
          order_number: string
          order_type: string
          partner_id?: string | null
          payment_status?: string | null
          responsible_user_id?: string | null
          status: string
          user_id: string
        }
        Update: {
          addresses?: Json | null
          amount?: number
          associated_supplier_id?: string | null
          client_id?: string
          created_at?: string
          files?: Json | null
          id?: string
          items?: Json | null
          notes?: string | null
          order_number?: string
          order_type?: string
          partner_id?: string | null
          payment_status?: string | null
          responsible_user_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_associated_supplier_id_fkey"
            columns: ["associated_supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          specialization: string | null
          terms: string | null
          user_id: string
        }
        Insert: {
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          specialization?: string | null
          terms?: string | null
          user_id: string
        }
        Update: {
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          specialization?: string | null
          terms?: string | null
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string
          default_supplier_id: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          sku: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          default_supplier_id?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number
          sku?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          default_supplier_id?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          sku?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_default_supplier_id_fkey"
            columns: ["default_supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          delivery_terms: string | null
          email: string | null
          id: string
          notes: string | null
          payment_terms: string | null
          phone: string | null
          product_categories_supplied: string | null
          rating: number | null
          secondary_phone: string | null
          supplier_name: string
          updated_at: string
          user_id: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          delivery_terms?: string | null
          email?: string | null
          id?: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          product_categories_supplied?: string | null
          rating?: number | null
          secondary_phone?: string | null
          supplier_name: string
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          delivery_terms?: string | null
          email?: string | null
          id?: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          product_categories_supplied?: string | null
          rating?: number | null
          secondary_phone?: string | null
          supplier_name?: string
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          contact_id: string | null
          created_at: string
          description: string
          due_date: string
          id: string
          order_id: string | null
          responsible_user_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          description: string
          due_date: string
          id?: string
          order_id?: string | null
          responsible_user_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          description?: string
          due_date?: string
          id?: string
          order_id?: string | null
          responsible_user_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
