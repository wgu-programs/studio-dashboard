export interface WorkspaceUser {
  workspace_user_id: string;
  user_id?: string | null;
  role?: string | null;
  created_at: string;
  workspace_id?: string | null;
}

export interface WorkspaceUsersTable {
  Row: WorkspaceUser;
  Insert: Partial<WorkspaceUser>;
  Update: Partial<WorkspaceUser>;
  Relationships: [
    {
      foreignKeyName: "workspace_users_workspace_id_fkey";
      columns: ["workspace_id"];
      isOneToOne: false;
      referencedRelation: "workspaces";
      referencedColumns: ["id"];
    }
  ];
}