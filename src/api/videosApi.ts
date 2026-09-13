import { fetchWithAuth } from "./fetchWithAuth";

const API_URL = import.meta.env.VITE_API_URL;

export class VideoSearchError extends Error {
  public readonly status: number;
  public readonly retryAfterSeconds?: number;

  constructor(
    status: number,
    retryAfterSeconds?: number
  ) {
    super(
      status === 429
        ? "Demasiadas búsquedas. Espera un momento e inténtalo otra vez."
        : "No se pudieron cargar los videos."
    );
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export const searchVideos = async ({
  q,
  company,
  page = 1,
  limit = 12,
}: {
  q: string;
  company?: string;
  page?: number;
  limit?: number;
}) => {
  const params = new URLSearchParams({
    q,
    page: page.toString(),
    limit: limit.toString(),
  });

  if (company) params.set("company", company);

  const res = await fetchWithAuth(`${API_URL}videos/search?${params}`);

  if (!res.ok) {
    const retryAfter = res.headers.get("Retry-After");
    throw new VideoSearchError(
      res.status,
      retryAfter ? Number(retryAfter) : undefined
    );
  }

  return res.json();
};
