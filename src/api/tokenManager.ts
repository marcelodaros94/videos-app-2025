import { getAuthToken } from "./authApi";

const configuredTtlMinutes = Number(import.meta.env.VITE_TOKEN_TTL_MINUTES);
const TOKEN_TTL_MS =
  (Number.isFinite(configuredTtlMinutes) && configuredTtlMinutes > 0
    ? configuredTtlMinutes
    : 55) *
  60 *
  1000;

const TOKEN_KEY = "videos_api_token";
const EXPIRES_AT_KEY = "videos_api_expires_at";

let inMemoryToken: string | null = null;
let tokenRequest: Promise<string> | null = null;

export const clearAuthToken = () => {
  inMemoryToken = null;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
};

export const getValidToken = async (): Promise<string> => {
  // 1️⃣ In-memory
  if (inMemoryToken) return inMemoryToken;

  // 2️⃣ localStorage
  const storedToken = localStorage.getItem(TOKEN_KEY);
  const expiresAt = localStorage.getItem(EXPIRES_AT_KEY);

  if (storedToken && expiresAt && Date.now() < Number(expiresAt)) {
    inMemoryToken = storedToken;
    return storedToken;
  }

  // 3️⃣ Evitar múltiples requests simultáneas
  if (!tokenRequest) {
    tokenRequest = getAuthToken()
      .then(({ accessToken }) => {
        const expiresAtMs = Date.now() + TOKEN_TTL_MS;

        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(EXPIRES_AT_KEY, expiresAtMs.toString());
        inMemoryToken = accessToken;

        return accessToken;
      })
      .finally(() => {
        tokenRequest = null;
      });
  }

  return tokenRequest;
};
