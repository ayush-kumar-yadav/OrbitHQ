import {
  useEffect,
  useState,
} from "react";

import {
  globalSearch,
} from "../../api/search.api";

import type {
  GlobalSearchResponse,
} from "../../api/search.api";

export function useGlobalSearch(
  query: string,
  enabled = true
) {
  const [data, setData] =
    useState<GlobalSearchResponse | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !query.trim()) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await globalSearch(
          query.trim()
        );

        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(
            "Global search failed:",
            err
          );

          setError(
            "Unable to search right now."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, enabled]);

  return {
    data,
    loading,
    error,
  };
}