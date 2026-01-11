import { useEffect, useState, useRef } from "react";
import { searchVideos } from "../api/videosApi";
import { useVideoStore } from "../stores/videoStore";

export const useVideoSearch = (query: string) => {
  const { results, setResults, appendResults } = useVideoStore();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!query) return;

    setResults([]);
    setPage(1);
    setHasMore(true);
  }, [query, setResults]);

  useEffect(() => {
    if (!query || !hasMore || isFetchingRef.current) return;

    const fetchData = async () => {
      isFetchingRef.current = true;
      setLoading(true);

      try {
        const data = await searchVideos({ q: query, page, limit: 12 });

        if (data.length === 0) {
          setHasMore(false);
          return;
        }

        if (page === 1) {
          setResults(data);
        } else {
          appendResults(data);
        }
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchData();
  }, [query, page, hasMore, setResults, appendResults]);

  return {
    results,
    loading,
    hasMore,
    loadMore: () => setPage((p) => p + 1),
  };
};
