import { useNavigate, Navigate, useParams } from "react-router-dom";
import { useVideoStore } from "../stores/videoStore";
import VideoPlayer from "../components/VideoPlayer";
import { mapApiVideoToSource } from "../utils/videoMapper";

const VideoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const video = useVideoStore((state) => state.selectedVideo);

  // Caso: refresh / acceso directo / estado perdido
  if (!video || video._id !== id) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6" style={{ marginLeft: "16px", marginRight: "16px"}}>
      {/* Botón volver */}
      <button
        onClick={() => navigate("/")}
        className="text-sm text-blue-600 hover:underline block"
        style={{ display: "block" }}
      >
        ← Back to search
      </button>

      {/* Player */}
      <VideoPlayer source={mapApiVideoToSource(video)} />

      {/* Info */}
      <div>
        <h2 className="text-2xl font-bold">{video.title}</h2>
        <p className="text-sm text-gray-500">
          {video.company} · {video?.show} · {video?.year} · {video?.stipulation}
        </p>
      </div>
    </div>
  );
};

export default VideoDetailPage;
