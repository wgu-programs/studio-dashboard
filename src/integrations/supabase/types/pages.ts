import { Json } from "./json";

export interface Page {
  page_id: string;
  project_id: string | null;
  run_id: string | null;
  url: string;
  title: string | null;
  html: string | null;
  snapshot_url: string | null;
  speakable_content: string[] | null;
  main_entity: string | null;
  keywords: string[] | null;
  last_reviewed: string | null;
  description: string | null;
  author: string | null;
  date_published: string | null;
  date_modified: string | null;
  created_at: string | null;
  crawler_id: string | null;
  status: string | null;
  workspace_id: number | null;
}

export interface PageInsert {
  url: string;
  project_id?: string | null;
  run_id?: string | null;
  title?: string | null;
  html?: string | null;
  snapshot_url?: string | null;
  speakable_content?: string[] | null;
  main_entity?: string | null;
  keywords?: string[] | null;
  last_reviewed?: string | null;
  description?: string | null;
  author?: string | null;
  date_published?: string | null;
  date_modified?: string | null;
  created_at?: string | null;
  crawler_id?: string | null;
  status?: string | null;
  workspace_id?: number | null;
}

export interface PageUpdate extends Partial<Page> {}