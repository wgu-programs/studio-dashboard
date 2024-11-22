import { Json } from '../database.types';

export interface Crawler {
  crawler_id: string;
  project_id?: string | null;
  name?: string | null;
  description?: string | null;
  start_urls?: Json | null;
  config?: Json | null;
  created_at?: string | null;
  download_images?: boolean | null;
  download_scripts?: boolean | null;
  download_css?: boolean | null;
  follow_external_links?: boolean | null;
  ignore_robots_exclusions?: boolean | null;
  ignore_nofollow?: boolean | null;
  include_supporting_files?: boolean | null;
  always_download_html_and_css?: boolean | null;
  download_error_pages?: boolean | null;
  ask_for_destination?: boolean | null;
  connections?: number | null;
  login_dialog?: string | null;
  file_replacement?: string | null;
  file_modification?: string | null;
  destination_folder?: string | null;
  maximum_depth?: number | null;
  maximum_files?: number | null;
  minimum_file_size?: number | null;
  maximum_file_size?: number | null;
  minimum_image_size?: number | null;
  retry_count?: number | null;
  user_agent?: string | null;
  delay_between_requests?: number | null;
  timeout_seconds?: number | null;
  workspace_id?: string | null;
}

export interface CrawlerTable {
  Row: Crawler;
  Insert: Partial<Omit<Crawler, 'crawler_id'>>;
  Update: Partial<Crawler>;
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
    }
  ];
}