import VideoPlayer from "./components/VideoPlayer";

export default function App() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h1>Wrestling Network</h1>

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


    </div>
  );
}
