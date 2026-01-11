import { Card, CardMedia, Box } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";
import { useVideoStore } from "../stores/videoStore";

export const VideoCard = ({ video }: { video: any }) => {
  const navigate = useNavigate();
  const selectVideo = useVideoStore((s) => s.selectVideo);

  const handleClick = () => {
    selectVideo(video);
    navigate(`/video/${video._id}`);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        position: "relative",
        "&:hover .overlay": { opacity: 1 },
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={video.thumbnail}
        alt={video.title}
      />

      {/* Overlay */}
      <Box
        className="overlay"
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0,
          transition: "opacity .2s",
        }}
      >
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: "50%",
            p: 2,
          }}
        >
          <PlayArrowIcon sx={{ fontSize: 40, color: "black" }} />
        </Box>
      </Box>
    </Card>
  );
};
