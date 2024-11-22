export interface Page {
  page_id: string;
  project_id?: string | null;
  run_id?: string | null;
  url: string;
  title?: string | null;
  html?: string | null;
  screenshot_url?: string | null;
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
  workspace_id?: string | null;
}

export interface PagesTable {
  Row: Page;
  Insert: Partial<Omit<Page, 'page_id'>> & {
    url: string;
  };
  Update: Partial<Page>;
  Relationships: [
    {
      foreignKeyName: "fk_pages_run";
      columns: ["run_id"];
      isOneToOne: false;
      referencedRelation: "runs";
      referencedColumns: ["run_id"];
    },
    {
      foreignKeyName: "pages_crawler_id_fkey";
      columns: ["crawler_id"];
      isOneToOne: false;
      referencedRelation: "crawler";
      referencedColumns: ["crawler_id"];
    },
    {
      foreignKeyName: "pages_project_id_fkey";
      columns: ["project_id"];
      isOneToOne: false;
      referencedRelation: "projects";
      referencedColumns: ["project_id"];
    },
    {
      foreignKeyName: "pages_run_id_fkey";
      columns: ["run_id"];
      isOneToOne: false;
      referencedRelation: "runs";
      referencedColumns: ["run_id"];
    },
    {
      foreignKeyName: "pages_workspace_id_fkey";
      columns: ["workspace_id"];
      isOneToOne: false;
      referencedRelation: "workspaces";
      referencedColumns: ["id"];
    }
  ];
}