export interface Run {
  run_id: string;
  crawler_id: string | null;
  status: string | null;
  started_at: string | null;
  completed_at: string | null;
  name: string | null;
  description: string | null;
}

export interface RunInsert extends Partial<Omit<Run, 'run_id'>> {
  run_id?: string;
}

export interface RunUpdate extends Partial<Run> {}