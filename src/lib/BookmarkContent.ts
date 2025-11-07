export interface BookmarkContent {
  title: string;
  url: string;
  timestamp: number;
  tags?: string[];

  description?: string;
  notes?: string;
}
