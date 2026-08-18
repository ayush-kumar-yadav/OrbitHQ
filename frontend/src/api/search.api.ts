import { api } from "./client";

export type SearchResultType =
  | "PROJECT"
  | "TASK"
  | "USER"
  | "COMMENT";

export interface GlobalSearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description?: string;
  subtitle?: string;
  url: string;
  metadata?: Record<string, unknown>;
}

export interface GlobalSearchResponse {
  query: string;
  results: GlobalSearchResult[];
  total: number;

  groups: {
    projects: GlobalSearchResult[];
    tasks: GlobalSearchResult[];
    users: GlobalSearchResult[];
    comments: GlobalSearchResult[];
  };
}

export async function globalSearch(
  query: string,
  limit = 5
): Promise<GlobalSearchResponse> {
  const response = await api.get("/search", {
    params: {
      q: query,
      limit,
    },
  });

  return response.data.data;
}