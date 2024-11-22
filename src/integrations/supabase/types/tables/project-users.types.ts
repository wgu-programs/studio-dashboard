export interface ProjectUser {
  id: string;
  project_id?: string | null;
  user_id?: string | null;
  created_at: string;
}

export interface ProjectUsersTable {
  Row: ProjectUser;
  Insert: Partial<ProjectUser>;
  Update: Partial<ProjectUser>;
  Relationships: [
    {
      foreignKeyName: "project_users_project_id_fkey";
      columns: ["project_id"];
      isOneToOne: false;
      referencedRelation: "projects";
      referencedColumns: ["project_id"];
    },
    {
      foreignKeyName: "project_users_user_id_fkey";
      columns: ["user_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    }
  ];
}