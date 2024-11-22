export interface Project {
  project_id: string;
  name: string;
  description?: string | null;
  created_at?: string | null;
  workspace_id?: string | null;
}

export interface ProjectsTable {
  Row: Project;
  Insert: Partial<Omit<Project, 'project_id'>> & {
    name: string;
  };
  Update: Partial<Project>;
  Relationships: [
    {
      foreignKeyName: "projects_workspace_id_fkey";
      columns: ["workspace_id"];
      isOneToOne: false;
      referencedRelation: "workspaces";
      referencedColumns: ["id"];
    }
  ];
}