import { Json } from "./json";

export interface Persona {
  persona_id: string;
  project_id: string | null;
  name: string;
  description: string | null;
  metadata: Json | null;
  created_at: string | null;
  workspace_id: string | null;
  goal: string | null;
}

export interface PersonaInsert {
  persona_id?: string;
  project_id?: string | null;
  name: string;
  description?: string | null;
  metadata?: Json | null;
  created_at?: string | null;
  workspace_id?: string | null;
  goal?: string | null;
}

export interface PersonaUpdate extends Partial<Persona> {}