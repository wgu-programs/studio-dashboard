import { Json } from "./json";

export interface Persona {
  persona_id: string;
  project_id: string | null;
  name: string;
  description: string | null;
  metadata: Json | null;
  created_at: string | null;
  workspace_id: number | null;
}

export interface PersonaInsert extends Partial<Omit<Persona, 'persona_id' | 'name'>> {
  persona_id?: string;
  name: string;
}

export interface PersonaUpdate extends Partial<Persona> {}