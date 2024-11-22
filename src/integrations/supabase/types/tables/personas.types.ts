import { Json } from '../database.types';

export interface Persona {
  persona_id: string;
  project_id?: string | null;
  name: string;
  description?: string | null;
  metadata?: Json | null;
  created_at?: string | null;
  workspace_id?: string | null;
  goal?: string | null;
}

export interface PersonasTable {
  Row: Persona;
  Insert: Partial<Omit<Persona, 'persona_id'>> & {
    name: string;
  };
  Update: Partial<Persona>;
  Relationships: [
    {
      foreignKeyName: "fk_project";
      columns: ["project_id"];
      isOneToOne: false;
      referencedRelation: "projects";
      referencedColumns: ["project_id"];
    },
    {
      foreignKeyName: "personas_project_id_fkey";
      columns: ["project_id"];
      isOneToOne: false;
      referencedRelation: "projects";
      referencedColumns: ["project_id"];
    },
    {
      foreignKeyName: "personas_workspace_id_fkey";
      columns: ["workspace_id"];
      isOneToOne: false;
      referencedRelation: "workspaces";
      referencedColumns: ["id"];
    }
  ];
}