import { Json } from "./json";

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  description: string | null;
  metadata: Json | null;
  avatar_url: string | null;
}

export interface ProfileInsert {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  description?: string | null;
  metadata?: Json | null;
  avatar_url?: string | null;
}

export interface ProfileUpdate {
  id?: string;
  first_name?: string | null;
  last_name?: string | null;
  description?: string | null;
  metadata?: Json | null;
  avatar_url?: string | null;
}