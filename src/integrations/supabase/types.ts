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
          timeout_seconds: number | null
          user_agent: string | null
          workspace_id: string | null
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
          timeout_seconds?: number | null
          user_agent?: string | null
          workspace_id?: string | null
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
          timeout_seconds?: number | null
          user_agent?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crawler_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "crawler_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
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
          screenshot_url: string | null
          speakable_content: string[] | null
          status: string | null
          title: string | null
          url: string
          workspace_id: string | null
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
          screenshot_url?: string | null
          speakable_content?: string[] | null
          status?: string | null
          title?: string | null
          url: string
          workspace_id?: string | null
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
          screenshot_url?: string | null
          speakable_content?: string[] | null
          status?: string | null
          title?: string | null
          url?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pages_run"
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
          {
            foreignKeyName: "pages_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
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
          workspace_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          metadata?: Json | null
          name: string
          persona_id?: string
          project_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          metadata?: Json | null
          name?: string
          persona_id?: string
          project_id?: string | null
          workspace_id?: string | null
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
          {
            foreignKeyName: "personas_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          description: string | null
          first_name: string | null
          id: string
          last_name: string | null
          metadata: Json | null
        }
        Insert: {
          avatar_url?: string | null
          description?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          metadata?: Json | null
        }
        Update: {
          avatar_url?: string | null
          description?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          metadata?: Json | null
        }
        Relationships: []
      }
      project_users: {
        Row: {
          created_at: string
          id: string
          project_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          project_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string | null
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
          {
            foreignKeyName: "project_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          name: string
          project_id: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          name: string
          project_id?: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          name?: string
          project_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      runs: {
        Row: {
          archived: boolean | null
          completed_at: string | null
          crawler_id: string | null
          description: string | null
          name: string | null
          project_id: string | null
          run_id: string
          started_at: string | null
          status: string | null
          workspace_id: string | null
        }
        Insert: {
          archived?: boolean | null
          completed_at?: string | null
          crawler_id?: string | null
          description?: string | null
          name?: string | null
          project_id?: string | null
          run_id?: string
          started_at?: string | null
          status?: string | null
          workspace_id?: string | null
        }
        Update: {
          archived?: boolean | null
          completed_at?: string | null
          crawler_id?: string | null
          description?: string | null
          name?: string | null
          project_id?: string | null
          run_id?: string
          started_at?: string | null
          status?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "runs_crawler_id_fkey"
            columns: ["crawler_id"]
            isOneToOne: false
            referencedRelation: "crawler"
            referencedColumns: ["crawler_id"]
          },
          {
            foreignKeyName: "runs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "runs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_users: {
        Row: {
          created_at: string
          role: string | null
          user_id: string | null
          workspace_id: string | null
          workspace_user_id: string
        }
        Insert: {
          created_at?: string
          role?: string | null
          user_id?: string | null
          workspace_id?: string | null
          workspace_user_id?: string
        }
        Update: {
          created_at?: string
          role?: string | null
          user_id?: string | null
          workspace_id?: string | null
          workspace_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_users_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
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
