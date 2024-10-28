export interface Workspace {
  id: number;
  created_at: string;
  name: string | null;
  description: string | null;
}

export interface WorkspaceInsert extends Partial<Workspace> {}

export interface WorkspaceUpdate extends Partial<Workspace> {}