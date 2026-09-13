import { useCallback, useEffect, useRef, useState } from "react";
import { searchVideos, VideoSearchError } from "../api/videosApi";
import { useVideoStore } from "../stores/videoStore";

const SEARCH_DEBOUNCE_MS = 350;

export const useVideoSearch = (query: string) => {
  const { results, setResults, appendResults } = useVideoStore();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const loadedQueryRef = useRef("");

  const requestPage = useCallback(
    async (searchQuery: string, requestedPage: number, replaceResults: boolean) => {
      const requestId = ++requestIdRef.current;
      setLoading(true);
      setError(null);

      try {
        const data = await searchVideos({
          q: searchQuery,
          page: requestedPage,
          limit: 12,
        });

        // A newer query/page was requested while this request was pending.
        if (requestId !== requestIdRef.current) return;

        if (data.length === 0) {
          setHasMore(false);
          return;
        }

        if (replaceResults) {
          setResults(data);
          loadedQueryRef.current = searchQuery;
        } else {
          appendResults(data);
        }

        setPage(requestedPage);
      } catch (error) {
        if (requestId !== requestIdRef.current) return;

        if (error instanceof VideoSearchError && error.status === 429) {
          const retryAfter = error.retryAfterSeconds;
          setError(
            retryAfter
              ? `Demasiadas búsquedas. Intenta de nuevo en ${retryAfter} segundo(s).`
              : error.message
          );
        } else {
          setError("No se pudieron cargar los videos. Intenta de nuevo.");
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [appendResults, setResults]
  );

  useEffect(() => {
    const searchQuery = query.trim();

    // Invalidate a prior response before queuing a request for this query.
    requestIdRef.current += 1;
    loadedQueryRef.current = "";

    if (!searchQuery) {
      setResults([]);
      setPage(1);
      setHasMore(false);
      setLoading(false);
      setError(null);
      return;
    }

    setResults([]);
    setPage(1);
    setHasMore(true);

    const debounceTimer = window.setTimeout(() => {
      void requestPage(searchQuery, 1, true);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(debounceTimer);
  }, [query, requestPage, setResults]);

  return {
    results,
    loading,
    error,
    hasMore,
    loadMore: () => {
      const searchQuery = query.trim();

      if (
        loading ||
        !hasMore ||
        !searchQuery ||
        loadedQueryRef.current !== searchQuery
      ) {
        return;
      }

      void requestPage(searchQuery, page + 1, false);
    },
  };
};
