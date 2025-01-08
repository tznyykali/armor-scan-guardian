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
      advanced_scan_results: {
        Row: {
          category: Database["public"]["Enums"]["detection_category"]
          created_at: string | null
          detection_details: Json
          id: string
          rule_match: string
          scan_id: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["detection_category"]
          created_at?: string | null
          detection_details?: Json
          id?: string
          rule_match: string
          scan_id?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["detection_category"]
          created_at?: string | null
          detection_details?: Json
          id?: string
          rule_match?: string
          scan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advanced_scan_results_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scan_history"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_history: {
        Row: {
          analysis_date: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          id: string
          permalink: string | null
          scan_status: string
          scan_timestamp: string | null
          scan_type: string
          stats: Json | null
          total_engines: number | null
          user_id: string | null
        }
        Insert: {
          analysis_date?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          permalink?: string | null
          scan_status: string
          scan_timestamp?: string | null
          scan_type: string
          stats?: Json | null
          total_engines?: number | null
          user_id?: string | null
        }
        Update: {
          analysis_date?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          permalink?: string | null
          scan_status?: string
          scan_timestamp?: string | null
          scan_type?: string
          stats?: Json | null
          total_engines?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      scan_results: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          detection_details: string[] | null
          engine_name: string | null
          engine_update: string | null
          engine_version: string | null
          file_path: string | null
          id: string
          metadata: Json | null
          result_details: Json | null
          rule_name: string
          scan_id: string | null
          severity: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          detection_details?: string[] | null
          engine_name?: string | null
          engine_update?: string | null
          engine_version?: string | null
          file_path?: string | null
          id?: string
          metadata?: Json | null
          result_details?: Json | null
          rule_name: string
          scan_id?: string | null
          severity?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          detection_details?: string[] | null
          engine_name?: string | null
          engine_update?: string | null
          engine_version?: string | null
          file_path?: string | null
          id?: string
          metadata?: Json | null
          result_details?: Json | null
          rule_name?: string
          scan_id?: string | null
          severity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scan_results_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scan_history"
            referencedColumns: ["id"]
          },
        ]
      }
      yara_rules: {
        Row: {
          category: Database["public"]["Enums"]["detection_category"]
          created_at: string | null
          description: string | null
          id: string
          name: string
          rule_content: string
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["detection_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          rule_content: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["detection_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          rule_content?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      detection_category:
        | "malware"
        | "encryption"
        | "obfuscation"
        | "document"
        | "cryptographic"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
