import {
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { useVideoStore } from "../stores/videoStore";

const companyHeaderColors: Record<string, string> = {
  WWE: "#7A1E22",
  AEW: "#8A6500",
  NJPW: "#9B1C31",
  Stardom: "#8C255C",
  AAA: "#1356A2",
  TNA: "#283593",
  CMLL: "#006B4F",
  ROH: "#4B5563",
  "Other Promotions": "#5B3B12",
};

export const VideoCard = ({ video }: { video: any }) => {
  const navigate = useNavigate();
  const selectVideo = useVideoStore((s) => s.selectVideo);
  const show = typeof video.show === "string" ? video.show.trim() : "";
  const year = video.year ? String(video.year) : "";
  const metadataLabel = show
    ? year
      ? `${show} (${year})`
      : show
    : year
      ? `(${year})`
      : video.company || null;
  const headerColor = companyHeaderColors[video.company] ?? "#5B3B12";
  const isDailymotion = video.provider?.toLowerCase() === "dailymotion";

  const handleClick = () => {
    selectVideo(video);
    navigate(`/video/${video._id}`);
  };

  return (
    <Card
      onClick={isDailymotion ? undefined : handleClick}
      aria-disabled={isDailymotion}
      sx={{
        background: "#0A0D12",
        cursor: isDailymotion ? "not-allowed" : "pointer",
        overflow: "hidden",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        "&:hover .overlay": isDailymotion ? {} : { opacity: 1 },
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

      <CardContent
        sx={{
          p: 1.5,
          "&:last-child": { pb: 1.5 },
          background: "rgba(18, 24, 32, 0.96)",
          height: 108,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
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
            minHeight: "2.6em",
          }}
        >
          {video.title}
        </Typography>

        {metadataLabel && (
          <Box
            sx={{
              height: 36,
              mx: -1.5,
              mt: 0.75,
              px: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
              bgcolor: headerColor,
            }}
          >
            <Typography
              variant="body2"
              noWrap
              title={metadataLabel}
              sx={{ color: "white", fontWeight: 500, textAlign: "center" }}
            >
              {metadataLabel}
            </Typography>
          </Box>
        )}

        <Box sx={{ flexGrow: 1 }} />
      </CardContent>

      {isDailymotion && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            bgcolor: "rgba(34, 39, 47, 0.82)",
            color: "rgba(255, 255, 255, 0.92)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            textAlign: "center",
            px: 2,
            pointerEvents: "auto",
          }}
        >
          <LockOutlinedIcon fontSize="large" />
          <Typography variant="body2" fontWeight={600}>
            Dailymotion no disponible por ahora
          </Typography>
        </Box>
      )}
    </Card>
  );
};
