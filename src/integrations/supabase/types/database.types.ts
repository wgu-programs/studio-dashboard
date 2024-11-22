export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      crawler: CrawlerTable;
      pages: PagesTable;
      personas: PersonasTable;
      profiles: ProfilesTable;
      project_users: ProjectUsersTable;
      projects: ProjectsTable;
      runs: RunsTable;
      workspace_users: WorkspaceUsersTable;
      workspaces: WorkspacesTable;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export interface TableRow<T> {
  Row: T;
  Insert: Partial<T>;
  Update: Partial<T>;
}

// Re-export all table types
export * from './tables/crawler.types';
export * from './tables/pages.types';
export * from './tables/personas.types';
export * from './tables/profiles.types';
export * from './tables/project-users.types';
export * from './tables/projects.types';
export * from './tables/runs.types';
export * from './tables/workspace-users.types';
export * from './tables/workspaces.types';