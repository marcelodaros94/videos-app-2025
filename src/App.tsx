/*import VideoSearchPage from "./pages/VideoSearchPage";


export default function App() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h1>Wrestling Network</h1>
{
    <VideoPlayer
  source={{
    provider: "dailymotion",
    videoId: "x8oixr6",
    startAt: 0,
  }}
  onEnded={() => {
    console.log("siguiente video");
  }}
/>
    <VideoPlayer
  source={{
    provider: "youtube",
    videoId: "P5JMLIkaxak",
    startAt: 0,
  }}
  onEnded={() => {
    console.log("siguiente video");
  }}
/>
      <VideoSearchPage/>

    </div>
  );
}
*/
import { Routes, Route } from "react-router-dom";
import VideoSearchPage from "./pages/VideoSearchPage";
import VideoDetailPage from "./pages/VideoDetailPage";
import { Fab, Box } from "@mui/material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";

const App = () => {
  return (
    <>
      {/* Floating Donations Button */}
      <Box
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1300,
        }}
      >
        <Fab
          variant="extended"
          color="primary"
          onClick={() =>
            window.open("https://buymeacoffee.com/cw94", "_blank")
          }
        >
          <VolunteerActivismIcon sx={{ mr: 1 }} />
          Donations 🙏
        </Fab>
      </Box>

      <h1>Stream Wrestling</h1>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<VideoSearchPage />} />
        <Route path="/video/:id" element={<VideoDetailPage />} />
      </Routes>
    </>
  );
};

export default App;

