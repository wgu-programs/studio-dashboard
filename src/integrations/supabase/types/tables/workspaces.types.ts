export interface Workspace {
  created_at: string;
  name?: string | null;
  description?: string | null;
  id: string;
}

export interface WorkspacesTable {
  Row: Workspace;
  Insert: Partial<Workspace>;
  Update: Partial<Workspace>;
  Relationships: [];
}