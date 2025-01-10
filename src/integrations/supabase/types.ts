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
      ml_model_metadata: {
        Row: {
          configuration: Json | null
          created_at: string | null
          description: string | null
          id: string
          model_name: string
          model_path: string
          model_type: Database["public"]["Enums"]["ml_model_type"]
          updated_at: string | null
          version: string
        }
        Insert: {
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          model_name: string
          model_path: string
          model_type: Database["public"]["Enums"]["ml_model_type"]
          updated_at?: string | null
          version: string
        }
        Update: {
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          model_name?: string
          model_path?: string
          model_type?: Database["public"]["Enums"]["ml_model_type"]
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      ml_scan_results: {
        Row: {
          analysis_metadata: Json | null
          confidence_score: number
          created_at: string | null
          detection_type: string
          id: string
          model_name: string
          model_version: string | null
          scan_id: string | null
        }
        Insert: {
          analysis_metadata?: Json | null
          confidence_score: number
          created_at?: string | null
          detection_type: string
          id?: string
          model_name: string
          model_version?: string | null
          scan_id?: string | null
        }
        Update: {
          analysis_metadata?: Json | null
          confidence_score?: number
          created_at?: string | null
          detection_type?: string
          id?: string
          model_name?: string
          model_version?: string | null
          scan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ml_scan_results_scan_id_fkey"
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
          file_metadata: Json | null
          file_name: string
          file_size: number | null
          file_type: string | null
          id: string
          malware_classification: string[] | null
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
          file_metadata?: Json | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          malware_classification?: string[] | null
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
          file_metadata?: Json | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          malware_classification?: string[] | null
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
          droidbox_analysis: Json | null
          engine_name: string | null
          engine_type:
            | Database["public"]["Enums"]["detection_engine_type"]
            | null
          engine_update: string | null
          engine_version: string | null
          file_path: string | null
          hash_identifiers: Json | null
          hids_findings: Json | null
          id: string
          malware_type: string | null
          metadata: Json | null
          result_details: Json | null
          rule_name: string | null
          scan_id: string | null
          severity: string | null
          snort_alerts: Json | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          detection_details?: string[] | null
          droidbox_analysis?: Json | null
          engine_name?: string | null
          engine_type?:
            | Database["public"]["Enums"]["detection_engine_type"]
            | null
          engine_update?: string | null
          engine_version?: string | null
          file_path?: string | null
          hash_identifiers?: Json | null
          hids_findings?: Json | null
          id?: string
          malware_type?: string | null
          metadata?: Json | null
          result_details?: Json | null
          rule_name?: string | null
          scan_id?: string | null
          severity?: string | null
          snort_alerts?: Json | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          detection_details?: string[] | null
          droidbox_analysis?: Json | null
          engine_name?: string | null
          engine_type?:
            | Database["public"]["Enums"]["detection_engine_type"]
            | null
          engine_update?: string | null
          engine_version?: string | null
          file_path?: string | null
          hash_identifiers?: Json | null
          hids_findings?: Json | null
          id?: string
          malware_type?: string | null
          metadata?: Json | null
          result_details?: Json | null
          rule_name?: string | null
          scan_id?: string | null
          severity?: string | null
          snort_alerts?: Json | null
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
      system_metrics: {
        Row: {
          battery_level: number
          cpu_usage: number
          created_at: string | null
          id: string
          memory_usage: number
          network_activity: number | null
          running_processes: string[] | null
          storage: number
          user_id: string | null
        }
        Insert: {
          battery_level: number
          cpu_usage: number
          created_at?: string | null
          id?: string
          memory_usage: number
          network_activity?: number | null
          running_processes?: string[] | null
          storage: number
          user_id?: string | null
        }
        Update: {
          battery_level?: number
          cpu_usage?: number
          created_at?: string | null
          id?: string
          memory_usage?: number
          network_activity?: number | null
          running_processes?: string[] | null
          storage?: number
          user_id?: string | null
        }
        Relationships: []
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
      latest_ml_models: {
        Row: {
          configuration: Json | null
          created_at: string | null
          description: string | null
          id: string | null
          model_name: string | null
          model_path: string | null
          model_type: Database["public"]["Enums"]["ml_model_type"] | null
          updated_at: string | null
          version: string | null
        }
        Relationships: []
      }
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
      detection_engine_type:
        | "snort"
        | "yaralyze"
        | "hids"
        | "droidbox"
        | "androguard"
        | "blacklist"
      ml_model_type:
        | "malware_detection"
        | "performance_optimization"
        | "resource_usage"
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
