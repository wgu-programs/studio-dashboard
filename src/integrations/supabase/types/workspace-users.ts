export interface WorkspaceUser {
  workspace_user_id: string;
  workspace_id: string | null;
  user_id: string | null;
  role: string | null;
  created_at: string;
}

export interface WorkspaceUserInsert extends Partial<Omit<WorkspaceUser, 'workspace_user_id'>> {
  workspace_user_id?: string;
}

export interface WorkspaceUserUpdate extends Partial<WorkspaceUser> {}