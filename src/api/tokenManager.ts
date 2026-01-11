import { getAuthToken } from "./authApi";

const TOKEN_EXPIRATION = import.meta.env.VITE_API_KEY;

const TOKEN_KEY = "videos_api_token";
const EXPIRES_AT_KEY = "videos_api_expires_at";

let inMemoryToken: string | null = null;
let isFetchingToken = false;
let pendingRequests: ((token: string) => void)[] = [];

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
  if (isFetchingToken) {
    return new Promise((resolve) => {
      pendingRequests.push(resolve);
    });
  }

  isFetchingToken = true;

  const { accessToken } = await getAuthToken();

  const expiresAtMs = Date.now() + TOKEN_EXPIRATION * 60 * 1000;

  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(EXPIRES_AT_KEY, expiresAtMs.toString());

  inMemoryToken = accessToken;
  isFetchingToken = false;

  pendingRequests.forEach((cb) => cb(accessToken));
  pendingRequests = [];

  return accessToken;
};
