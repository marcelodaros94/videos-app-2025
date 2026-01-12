import { useState, useRef, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import VideoPlayer from "../components/VideoPlayer";
import { useVideoSearch } from "../hooks/useVideoSearch";
import { mapApiVideoToSource } from "../utils/videoMapper";
import { VideoCard } from "../components/VideoCard";

import {
  Container,
  Box,
  Typography,
  Button,
} from "@mui/material";

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

  useEffect(() => {
    if (currentIndex !== null) {
      playerRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentIndex]);

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <SearchBar onSearch={setQuery} />
      </Box>

      <Box ref={playerRef} mb={4}>
        {currentVideo && (
          <VideoPlayer source={currentVideo} onEnded={handleEnded} />
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
        }}
      >
        {results.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </Box>

      {loading && (
        <Typography align="center" mt={4}>
          Loading...
        </Typography>
      )}

      {hasMore && !loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Button variant="contained" onClick={loadMore}>
            Load more
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default VideoSearchPage;
