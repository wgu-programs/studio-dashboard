import { Json } from "./json";

export interface Project {
  project_id: string;
  name: string;
  description: string | null;
  created_at: string | null;
  workspace_id: number | null;
}

export interface ProjectInsert {
  project_id?: string;
  name: string;
  description?: string | null;
  created_at?: string | null;
  workspace_id?: number | null;
}

export interface ProjectUpdate {
  project_id?: string;
  name?: string;
  description?: string | null;
  created_at?: string | null;
  workspace_id?: number | null;
}