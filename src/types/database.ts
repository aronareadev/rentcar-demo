export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      consultations: {
        Row: {
          admin_memo: string | null
          consultation_number: string
          content: string
          created_at: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          id: string
          is_read: boolean | null
          preferred_vehicle: string | null
          priority: string | null
          rental_end_date: string | null
          rental_start_date: string | null
          status: string | null
          subject: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          admin_memo?: string | null
          consultation_number: string
          content: string
          created_at?: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          id?: string
          is_read?: boolean | null
          preferred_vehicle?: string | null
          priority?: string | null
          rental_end_date?: string | null
          rental_start_date?: string | null
          status?: string | null
          subject: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_memo?: string | null
          consultation_number?: string
          content?: string
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          is_read?: boolean | null
          preferred_vehicle?: string | null
          priority?: string | null
          rental_end_date?: string | null
          rental_start_date?: string | null
          status?: string | null
          subject?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_blacklisted: boolean | null
          license_expiry_date: string
          license_number: string
          name: string
          phone: string
          tier: string | null
          total_rentals: number | null
          total_spent: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_blacklisted?: boolean | null
          license_expiry_date: string
          license_number: string
          name: string
          phone: string
          tier?: string | null
          total_rentals?: number | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_blacklisted?: boolean | null
          license_expiry_date?: string
          license_number?: string
          name?: string
          phone?: string
          tier?: string | null
          total_rentals?: number | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string | null
          customer_id: string | null
          end_date: string
          id: string
          paid_amount: number | null
          payment_status: string | null
          pickup_location: string
          reservation_number: string
          return_location: string
          start_date: string
          status: string | null
          total_amount: number
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          end_date: string
          id?: string
          paid_amount?: number | null
          payment_status?: string | null
          pickup_location: string
          reservation_number: string
          return_location: string
          start_date: string
          status?: string | null
          total_amount: number
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          end_date?: string
          id?: string
          paid_amount?: number | null
          payment_status?: string | null
          pickup_location?: string
          reservation_number?: string
          return_location?: string
          start_date?: string
          status?: string | null
          total_amount?: number
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_brands: {
        Row: {
          country: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          name_en: string | null
          updated_at: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          name_en?: string | null
          updated_at?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          name_en?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vehicle_categories: {
        Row: {
          base_daily_rate: number
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price_multiplier: number | null
          updated_at: string | null
        }
        Insert: {
          base_daily_rate?: number
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price_multiplier?: number | null
          updated_at?: string | null
        }
        Update: {
          base_daily_rate?: number
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_multiplier?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vehicle_locations: {
        Row: {
          address: string
          created_at: string | null
          id: string
          is_active: boolean | null
          manager_name: string | null
          manager_phone: string | null
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          manager_name?: string | null
          manager_phone?: string | null
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          manager_name?: string | null
          manager_phone?: string | null
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vehicle_models: {
        Row: {
          brand: string
          category: string | null
          created_at: string | null
          displacement: number | null
          estimated_daily_rate: number
          features: Json | null
          fuel_type: string
          id: string
          image: Json | null
          is_active: boolean
          model: string
          passengers: number
          transmission: string
          updated_at: string | null
          year: number
        }
        Insert: {
          brand: string
          category?: string | null
          created_at?: string | null
          displacement?: number | null
          estimated_daily_rate?: number
          features?: Json | null
          fuel_type?: string
          id?: string
          image?: Json | null
          is_active?: boolean
          model: string
          passengers?: number
          transmission?: string
          updated_at?: string | null
          year?: number
        }
        Update: {
          brand?: string
          category?: string | null
          created_at?: string | null
          displacement?: number | null
          estimated_daily_rate?: number
          features?: Json | null
          fuel_type?: string
          id?: string
          image?: Json | null
          is_active?: boolean
          model?: string
          passengers?: number
          transmission?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          brand: string
          brand_id: string | null
          category: string | null
          category_id: string | null
          color: string | null
          created_at: string | null
          daily_rate: number
          displacement: number | null
          features: Json | null
          fuel_type: string | null
          id: string
          images: Json | null
          insurance: Json | null
          last_inspection_date: string | null
          location: string | null
          location_id: string | null
          mileage: number | null
          model: string
          monthly_rate: number | null
          passengers: number | null
          status: string | null
          total_rentals: number | null
          total_revenue: number | null
          transmission: string | null
          updated_at: string | null
          vehicle_number: string
          weekly_rate: number | null
          year: number
        }
        Insert: {
          brand: string
          brand_id?: string | null
          category?: string | null
          category_id?: string | null
          color?: string | null
          created_at?: string | null
          daily_rate: number
          displacement?: number | null
          features?: Json | null
          fuel_type?: string | null
          id?: string
          images?: Json | null
          insurance?: Json | null
          last_inspection_date?: string | null
          location?: string | null
          location_id?: string | null
          mileage?: number | null
          model: string
          monthly_rate?: number | null
          passengers?: number | null
          status?: string | null
          total_rentals?: number | null
          total_revenue?: number | null
          transmission?: string | null
          updated_at?: string | null
          vehicle_number: string
          weekly_rate?: number | null
          year: number
        }
        Update: {
          brand?: string
          brand_id?: string | null
          category?: string | null
          category_id?: string | null
          color?: string | null
          created_at?: string | null
          daily_rate?: number
          displacement?: number | null
          features?: Json | null
          fuel_type?: string | null
          id?: string
          images?: Json | null
          insurance?: Json | null
          last_inspection_date?: string | null
          location?: string | null
          location_id?: string | null
          mileage?: number | null
          model?: string
          monthly_rate?: number | null
          passengers?: number | null
          status?: string | null
          total_rentals?: number | null
          total_revenue?: number | null
          transmission?: string | null
          updated_at?: string | null
          vehicle_number?: string
          weekly_rate?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicles_brand"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "vehicle_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_vehicles_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "vehicle_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_vehicles_location"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "vehicle_locations"
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