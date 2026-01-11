import { useState, useRef, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import VideoPlayer from "../components/VideoPlayer";
import { useVideoSearch } from "../hooks/useVideoSearch";
import { mapApiVideoToSource } from "../utils/videoMapper";
import { VideoCard } from "../components/VideoCard";

const VideoSearchPage = () => {
  const [query, setQuery] = useState("");
  const { results, loading, loadMore, hasMore } = useVideoSearch(query);

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const currentVideo =
    currentIndex !== null ? mapApiVideoToSource(results[currentIndex]) : null;

  const handleEnded = () => {
    setCurrentIndex((prev) => {
      if (prev === null) return null;
      if (prev + 1 >= results.length) return prev;
      return prev + 1;
    });
  };

  // 👉 Scroll automático al player
  useEffect(() => {
    if (currentIndex !== null) {
      playerRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentIndex]);

  return (
    <div className="space-y-6">
      <SearchBar onSearch={setQuery} />

      <div ref={playerRef}>
        {currentVideo && (
          <VideoPlayer source={currentVideo} onEnded={handleEnded} />
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {results.map((video) => (
          <VideoCard
            key={video._id}
            video={video}
          />
        ))}
      </div>

      {loading && <p className="text-center">Loading...</p>}

      {hasMore && !loading && (
        <button
          onClick={loadMore}
          className="mx-auto block px-6 py-2 rounded bg-black text-white"
        >
          Load more
        </button>
      )}
    </div>
  );
};

export default VideoSearchPage;
