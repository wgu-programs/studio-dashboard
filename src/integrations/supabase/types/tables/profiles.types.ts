import { Json } from '../database.types';

export interface Profile {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  description?: string | null;
  metadata?: Json | null;
  avatar_url?: string | null;
}

export interface ProfilesTable {
  Row: Profile;
  Insert: Profile;
  Update: Partial<Profile>;
  Relationships: [];
}