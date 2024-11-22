export interface Page {
  page_id: string;
  project_id: string | null;
  run_id: string | null;
  url: string;
  title: string | null;
  html: string | null;
  screenshot_url: string | null;
  snapshot_url: string | null;
  speakable_content: string[] | null;
  main_entity: string | null;
  keywords: string[] | null;
  last_reviewed: string | null;
  description: string | null;
  author: string | null;
  date_published: string | null;
  date_modified: string | null;
  created_at: string | null;
  crawler_id: string | null;
  status: string | null;
  workspace_id: string | null;
}

export interface PageInsert extends Partial<Omit<Page, 'page_id'>> {
  page_id?: string;
  url: string;
}

export interface PageUpdate extends Partial<Page> {}