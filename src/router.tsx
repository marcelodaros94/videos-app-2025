import { createBrowserRouter } from "react-router-dom";
import VideoSearchPage from "./pages/VideoSearchPage";
import VideoDetailPage from "./pages/VideoDetailPage";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <VideoSearchPage />,
  },
  {
    path: "/video/:id",
    element: <VideoDetailPage />,
  },
]);
