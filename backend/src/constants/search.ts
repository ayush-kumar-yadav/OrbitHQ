export enum SearchResultType {
  PROJECT = "PROJECT",
  TASK = "TASK",
  USER = "USER",
  COMMENT = "COMMENT",
}

export interface GlobalSearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description?: string;
  subtitle?: string;
  url: string;
  metadata?: Record<string, unknown>;
}