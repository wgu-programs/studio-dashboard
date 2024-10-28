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
      crawler: {
        Row: {
          always_download_html_and_css: boolean | null
          ask_for_destination: boolean | null
          config: Json | null
          connections: number | null
          crawler_id: string
          created_at: string | null
          delay_between_requests: number | null
          description: string | null
          destination_folder: string | null
          download_css: boolean | null
          download_error_pages: boolean | null
          download_images: boolean | null
          download_scripts: boolean | null
          file_modification: string | null
          file_replacement: string | null
          follow_external_links: boolean | null
          ignore_nofollow: boolean | null
          ignore_robots_exclusions: boolean | null
          include_supporting_files: boolean | null
          login_dialog: string | null
          maximum_depth: number | null
          maximum_file_size: number | null
          maximum_files: number | null
          minimum_file_size: number | null
          minimum_image_size: number | null
          name: string | null
          project_id: string | null
          retry_count: number | null
          start_urls: Json | null
          status: string | null
          timeout_seconds: number | null
          user_agent: string | null
        }
        Insert: {
          always_download_html_and_css?: boolean | null
          ask_for_destination?: boolean | null
          config?: Json | null
          connections?: number | null
          crawler_id?: string
          created_at?: string | null
          delay_between_requests?: number | null
          description?: string | null
          destination_folder?: string | null
          download_css?: boolean | null
          download_error_pages?: boolean | null
          download_images?: boolean | null
          download_scripts?: boolean | null
          file_modification?: string | null
          file_replacement?: string | null
          follow_external_links?: boolean | null
          ignore_nofollow?: boolean | null
          ignore_robots_exclusions?: boolean | null
          include_supporting_files?: boolean | null
          login_dialog?: string | null
          maximum_depth?: number | null
          maximum_file_size?: number | null
          maximum_files?: number | null
          minimum_file_size?: number | null
          minimum_image_size?: number | null
          name?: string | null
          project_id?: string | null
          retry_count?: number | null
          start_urls?: Json | null
          status?: string | null
          timeout_seconds?: number | null
          user_agent?: string | null
        }
        Update: {
          always_download_html_and_css?: boolean | null
          ask_for_destination?: boolean | null
          config?: Json | null
          connections?: number | null
          crawler_id?: string
          created_at?: string | null
          delay_between_requests?: number | null
          description?: string | null
          destination_folder?: string | null
          download_css?: boolean | null
          download_error_pages?: boolean | null
          download_images?: boolean | null
          download_scripts?: boolean | null
          file_modification?: string | null
          file_replacement?: string | null
          follow_external_links?: boolean | null
          ignore_nofollow?: boolean | null
          ignore_robots_exclusions?: boolean | null
          include_supporting_files?: boolean | null
          login_dialog?: string | null
          maximum_depth?: number | null
          maximum_file_size?: number | null
          maximum_files?: number | null
          minimum_file_size?: number | null
          minimum_image_size?: number | null
          name?: string | null
          project_id?: string | null
          retry_count?: number | null
          start_urls?: Json | null
          status?: string | null
          timeout_seconds?: number | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crawler_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
        ]
      }
      pages: {
        Row: {
          author: string | null
          crawler_id: string | null
          created_at: string | null
          date_modified: string | null
          date_published: string | null
          description: string | null
          html: string | null
          keywords: string[] | null
          last_reviewed: string | null
          main_entity: string | null
          page_id: string
          project_id: string | null
          run_id: string | null
          snapshot_url: string | null
          speakable_content: string[] | null
          status: string | null
          title: string | null
          url: string
        }
        Insert: {
          author?: string | null
          crawler_id?: string | null
          created_at?: string | null
          date_modified?: string | null
          date_published?: string | null
          description?: string | null
          html?: string | null
          keywords?: string[] | null
          last_reviewed?: string | null
          main_entity?: string | null
          page_id?: string
          project_id?: string | null
          run_id?: string | null
          snapshot_url?: string | null
          speakable_content?: string[] | null
          status?: string | null
          title?: string | null
          url: string
        }
        Update: {
          author?: string | null
          crawler_id?: string | null
          created_at?: string | null
          date_modified?: string | null
          date_published?: string | null
          description?: string | null
          html?: string | null
          keywords?: string[] | null
          last_reviewed?: string | null
          main_entity?: string | null
          page_id?: string
          project_id?: string | null
          run_id?: string | null
          snapshot_url?: string | null
          speakable_content?: string[] | null
          status?: string | null
          title?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "fk_run"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_id"]
          },
          {
            foreignKeyName: "pages_crawler_id_fkey"
            columns: ["crawler_id"]
            isOneToOne: false
            referencedRelation: "crawler"
            referencedColumns: ["crawler_id"]
          },
          {
            foreignKeyName: "pages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "pages_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["run_id"]
          },
        ]
      }
      personas: {
        Row: {
          created_at: string | null
          description: string | null
          metadata: Json | null
          name: string
          persona_id: string
          project_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          metadata?: Json | null
          name: string
          persona_id?: string
          project_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          metadata?: Json | null
          name?: string
          persona_id?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "personas_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
        ]
      }
      profiles: {
        Row: {
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          first_name?: string | null
          id: string
          last_name?: string | null
        }
        Update: {
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: []
      }
      project_users: {
        Row: {
          created_at: string | null
          project_id: string | null
          project_user_id: string
          role: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          project_id?: string | null
          project_user_id?: string
          role?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          project_id?: string | null
          project_user_id?: string
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_users_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          name: string
          project_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          name: string
          project_id?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          name?: string
          project_id?: string
        }
        Relationships: []
      }
      runs: {
        Row: {
          completed_at: string | null
          crawler_id: string | null
          description: string | null
          name: string | null
          run_id: string
          started_at: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          crawler_id?: string | null
          description?: string | null
          name?: string | null
          run_id?: string
          started_at?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          crawler_id?: string | null
          description?: string | null
          name?: string | null
          run_id?: string
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "runs_crawler_id_fkey"
            columns: ["crawler_id"]
            isOneToOne: false
            referencedRelation: "crawler"
            referencedColumns: ["crawler_id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
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
      [_ in never]: never
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
