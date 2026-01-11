const API_URL = import.meta.env.VITE_API_URL;

const API_KEY = import.meta.env.VITE_API_KEY; // no hardcodees

export interface AuthTokenResponse {
  accessToken: string;
}

export const getAuthToken = async (): Promise<AuthTokenResponse> => {
  const res = await fetch(`${API_URL}auth/token`, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to get auth token");
  }

  return res.json();
};
