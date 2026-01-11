import { fetchWithAuth } from "./fetchWithAuth";

const API_URL = import.meta.env.VITE_API_URL;

export const searchVideos = async ({
  q,
  page = 1,
  limit = 12,
}: {
  q: string;
  page?: number;
  limit?: number;
}) => {
  const params = new URLSearchParams({
    q,
    page: page.toString(),
    limit: limit.toString(),
  });

  const res = await fetchWithAuth(`${API_URL}videos/search?${params}`);

  if (!res.ok) {
    throw new Error("Error fetching videos");
  }

  return res.json();
};
