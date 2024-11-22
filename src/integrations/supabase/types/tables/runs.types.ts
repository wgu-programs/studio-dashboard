export interface Run {
  run_id: string;
  crawler_id?: string | null;
  status?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  name?: string | null;
  description?: string | null;
  archived?: boolean | null;
  workspace_id?: string | null;
  project_id?: string | null;
}

export interface RunsTable {
  Row: Run;
  Insert: Partial<Run>;
  Update: Partial<Run>;
  Relationships: [
    {
      foreignKeyName: "runs_crawler_id_fkey";
      columns: ["crawler_id"];
      isOneToOne: false;
      referencedRelation: "crawler";
      referencedColumns: ["crawler_id"];
    },
    {
      foreignKeyName: "runs_project_id_fkey";
      columns: ["project_id"];
      isOneToOne: false;
      referencedRelation: "projects";
      referencedColumns: ["project_id"];
    },
    {
      foreignKeyName: "runs_workspace_id_fkey";
      columns: ["workspace_id"];
      isOneToOne: false;
      referencedRelation: "workspaces";
      referencedColumns: ["id"];
    }
  ];
}