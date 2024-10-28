import { Json } from "./json";
import { Profile, ProfileInsert, ProfileUpdate } from "./profiles";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      crawler: {
        Row: {
          always_download_html_and_css: boolean | null;
          ask_for_destination: boolean | null;
          config: Json | null;
          connections: number | null;
          crawler_id: string;
          created_at: string | null;
          delay_between_requests: number | null;
          description: string | null;
          destination_folder: string | null;
          download_css: boolean | null;
          download_error_pages: boolean | null;
          download_images: boolean | null;
          download_scripts: boolean | null;
          file_modification: string | null;
          file_replacement: string | null;
          follow_external_links: boolean | null;
          ignore_nofollow: boolean | null;
          ignore_robots_exclusions: boolean | null;
          include_supporting_files: boolean | null;
          login_dialog: string | null;
          maximum_depth: number | null;
          maximum_file_size: number | null;
          maximum_files: number | null;
          minimum_file_size: number | null;
          minimum_image_size: number | null;
          name: string | null;
          project_id: string | null;
          retry_count: number | null;
          start_urls: Json | null;
          status: string | null;
          timeout_seconds: number | null;
          user_agent: string | null;
          workspace_id: number | null;
        };
        Insert: {
          always_download_html_and_css?: boolean | null;
          ask_for_destination?: boolean | null;
          config?: Json | null;
          connections?: number | null;
          crawler_id?: string;
          created_at?: string | null;
          delay_between_requests?: number | null;
          description?: string | null;
          destination_folder?: string | null;
          download_css?: boolean | null;
          download_error_pages?: boolean | null;
          download_images?: boolean | null;
          download_scripts?: boolean | null;
          file_modification?: string | null;
          file_replacement?: string | null;
          follow_external_links?: boolean | null;
          ignore_nofollow?: boolean | null;
          ignore_robots_exclusions?: boolean | null;
          include_supporting_files?: boolean | null;
          login_dialog?: string | null;
          maximum_depth?: number | null;
          maximum_file_size?: number | null;
          maximum_files?: number | null;
          minimum_file_size?: number | null;
          minimum_image_size?: number | null;
          name?: string | null;
          project_id?: string | null;
          retry_count?: number | null;
          start_urls?: Json | null;
          status?: string | null;
          timeout_seconds?: number | null;
          user_agent?: string | null;
          workspace_id?: number | null;
        };
        Update: {
          always_download_html_and_css?: boolean | null;
          ask_for_destination?: boolean | null;
          config?: Json | null;
          connections?: number | null;
          crawler_id?: string;
          created_at?: string | null;
          delay_between_requests?: number | null;
          description?: string | null;
          destination_folder?: string | null;
          download_css?: boolean | null;
          download_error_pages?: boolean | null;
          download_images?: boolean | null;
          download_scripts?: boolean | null;
          file_modification?: string | null;
          file_replacement?: string | null;
          follow_external_links?: boolean | null;
          ignore_nofollow?: boolean | null;
          ignore_robots_exclusions?: boolean | null;
          include_supporting_files?: boolean | null;
          login_dialog?: string | null;
          maximum_depth?: number | null;
          maximum_file_size?: number | null;
          maximum_files?: number | null;
          minimum_file_size?: number | null;
          minimum_image_size?: number | null;
          name?: string | null;
          project_id?: string | null;
          retry_count?: number | null;
          start_urls?: Json | null;
          status?: string | null;
          timeout_seconds?: number | null;
          user_agent?: string | null;
          workspace_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "crawler_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["project_id"];
          },
          {
            foreignKeyName: "crawler_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      pages: {
        Row: {
          author: string | null;
          crawler_id: string | null;
          created_at: string | null;
          date_modified: string | null;
          date_published: string | null;
          description: string | null;
          html: string | null;
          keywords: string[] | null;
          last_reviewed: string | null;
          main_entity: string | null;
          page_id: string;
          project_id: string | null;
          run_id: string | null;
          snapshot_url: string | null;
          speakable_content: string[] | null;
          status: string | null;
          title: string | null;
          url: string;
          workspace_id: number | null;
        };
        Insert: {
          author?: string | null;
          crawler_id?: string | null;
          created_at?: string | null;
          date_modified?: string | null;
          date_published?: string | null;
          description?: string | null;
          html?: string | null;
          keywords?: string[] | null;
          last_reviewed?: string | null;
          main_entity?: string | null;
          page_id?: string;
          project_id?: string | null;
          run_id?: string | null;
          snapshot_url?: string | null;
          speakable_content?: string[] | null;
          status?: string | null;
          title?: string | null;
          url: string;
          workspace_id?: number | null;
        };
        Update: {
          author?: string | null;
          crawler_id?: string | null;
          created_at?: string | null;
          date_modified?: string | null;
          date_published?: string | null;
          description?: string | null;
          html?: string | null;
          keywords?: string[] | null;
          last_reviewed?: string | null;
          main_entity?: string | null;
          page_id?: string;
          project_id?: string | null;
          run_id?: string | null;
          snapshot_url?: string | null;
          speakable_content?: string[] | null;
          status?: string | null;
          title?: string | null;
          url?: string;
          workspace_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_project";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["project_id"];
          },
          {
            foreignKeyName: "fk_run";
            columns: ["run_id"];
            isOneToOne: false;
            referencedRelation: "runs";
            referencedColumns: ["run_id"];
          },
          {
            foreignKeyName: "pages_crawler_id_fkey";
            columns: ["crawler_id"];
            isOneToOne: false;
            referencedRelation: "crawler";
            referencedColumns: ["crawler_id"];
          },
          {
            foreignKeyName: "pages_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["project_id"];
          },
          {
            foreignKeyName: "pages_run_id_fkey";
            columns: ["run_id"];
            isOneToOne: false;
            referencedRelation: "runs";
            referencedColumns: ["run_id"];
          },
          {
            foreignKeyName: "pages_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      personas: {
        Row: {
          created_at: string | null;
          description: string | null;
          metadata: Json | null;
          name: string;
          persona_id: string;
          project_id: string | null;
          workspace_id: number | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          metadata?: Json | null;
          name: string;
          persona_id?: string;
          project_id?: string | null;
          workspace_id?: number | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          metadata?: Json | null;
          name?: string;
          persona_id?: string;
          project_id?: string | null;
          workspace_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_project";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["project_id"];
          },
          {
            foreignKeyName: "personas_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["project_id"];
          },
          {
            foreignKeyName: "personas_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          description: string | null;
          first_name: string | null;
          id: string;
          last_name: string | null;
          metadata: Json | null;
        };
        Insert: {
          avatar_url?: string | null;
          description?: string | null;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          metadata?: Json | null;
        };
        Update: {
          avatar_url?: string | null;
          description?: string | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          metadata?: Json | null;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          created_at: string | null;
          description: string | null;
          name: string;
          project_id: string;
          workspace_id: number | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          name: string;
          project_id?: string;
          workspace_id?: number | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          name?: string;
          project_id?: string;
          workspace_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "projects_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      runs: {
        Row: {
          completed_at: string | null;
          crawler_id: string | null;
          description: string | null;
          name: string | null;
          run_id: string;
          started_at: string | null;
          status: string | null;
        };
        Insert: {
          completed_at?: string | null;
          crawler_id?: string | null;
          description?: string | null;
          name?: string | null;
          run_id?: string;
          started_at?: string | null;
          status?: string | null;
        };
        Update: {
          completed_at?: string | null;
          crawler_id?: string | null;
          description?: string | null;
          name?: string | null;
          run_id?: string;
          started_at?: string | null;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "runs_crawler_id_fkey";
            columns: ["crawler_id"];
            isOneToOne: false;
            referencedRelation: "crawler";
            referencedColumns: ["crawler_id"];
          },
        ];
      };
      workspace_users: {
        Row: {
          created_at: string;
          role: string | null;
          user_id: string | null;
          workspace_id: number | null;
          workspace_user_id: string;
        };
        Insert: {
          created_at?: string;
          role?: string | null;
          user_id?: string | null;
          workspace_id?: number | null;
          workspace_user_id?: string;
        };
        Update: {
          created_at?: string;
          role?: string | null;
          user_id?: string | null;
          workspace_id?: number | null;
          workspace_user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workspace_users_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      workspaces: {
        Row: {
          created_at: string;
          description: string | null;
          id: number;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: number;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: number;
          name?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type { Json, Profile, ProfileInsert, ProfileUpdate };
