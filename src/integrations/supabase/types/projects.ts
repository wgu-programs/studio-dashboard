export interface Project {
  project_id: string;
  name: string;
  description: string | null;
  created_at: string | null;
  workspace_id: string | null;
}

export interface ProjectInsert {
  project_id?: string;
  name: string;
  description?: string | null;
  created_at?: string | null;
  workspace_id?: string | null;
}

export interface ProjectUpdate {
  project_id?: string;
  name?: string;
  description?: string | null;
  created_at?: string | null;
  workspace_id?: string | null;
}