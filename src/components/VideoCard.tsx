import {
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
} from "@mui/material";
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
        background: "black",
        cursor: "pointer",
        overflow: "hidden",
        "&:hover .overlay": { opacity: 1 },
      }}
    >
      {/* Thumbnail */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          image={video.thumbnail}
          alt={video.title}
          sx={{
            height: 180,
            objectFit: "cover",
          }}
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
            transition: "opacity .2s ease-in-out",
          }}
        >
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: "50%",
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PlayArrowIcon sx={{ fontSize: 42, color: "black" }} />
          </Box>
        </Box>
      </Box>

      {/* Title */}
      <CardContent sx={{ py: 1.5, background: "black" }}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          lineHeight={1.3}
          sx={{
            color: "white",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {video.title}
        </Typography>
        
      </CardContent>
    </Card>
  );
};
