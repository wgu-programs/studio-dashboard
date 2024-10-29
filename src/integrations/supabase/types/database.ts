import { Json } from "./json";
import { Profile, ProfileInsert, ProfileUpdate } from "./profiles";
import { Project, ProjectInsert, ProjectUpdate } from "./projects";
import { Crawler, CrawlerInsert, CrawlerUpdate } from "./crawler";
import { Page, PageInsert, PageUpdate } from "./pages";
import { Persona, PersonaInsert, PersonaUpdate } from "./personas";
import { Run, RunInsert, RunUpdate } from "./runs";
import { Workspace, WorkspaceInsert, WorkspaceUpdate } from "./workspaces";
import { WorkspaceUser, WorkspaceUserInsert, WorkspaceUserUpdate } from "./workspace-users";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      projects: {
        Row: Project;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
        Relationships: [
          {
            foreignKeyName: "projects_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          }
        ];
      };
      crawler: {
        Row: Crawler;
        Insert: CrawlerInsert;
        Update: CrawlerUpdate;
        Relationships: [
          {
            foreignKeyName: "crawler_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["project_id"];
          }
        ];
      };
      pages: {
        Row: Page;
        Insert: PageInsert;
        Update: PageUpdate;
        Relationships: [
          {
            foreignKeyName: "pages_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["project_id"];
          }
        ];
      };
      personas: {
        Row: Persona;
        Insert: PersonaInsert;
        Update: PersonaUpdate;
        Relationships: [
          {
            foreignKeyName: "personas_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["project_id"];
          }
        ];
      };
      runs: {
        Row: Run;
        Insert: RunInsert;
        Update: RunUpdate;
        Relationships: [
          {
            foreignKeyName: "runs_crawler_id_fkey";
            columns: ["crawler_id"];
            isOneToOne: false;
            referencedRelation: "crawler";
            referencedColumns: ["crawler_id"];
          }
        ];
      };
      workspaces: {
        Row: Workspace;
        Insert: WorkspaceInsert;
        Update: WorkspaceUpdate;
        Relationships: [];
      };
      workspace_users: {
        Row: WorkspaceUser;
        Insert: WorkspaceUserInsert;
        Update: WorkspaceUserUpdate;
        Relationships: [
          {
            foreignKeyName: "workspace_users_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          }
        ];
      };
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
};