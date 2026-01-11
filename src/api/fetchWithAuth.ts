import { getValidToken } from "./tokenManager";

export const fetchWithAuth = async (
  input: RequestInfo,
  init: RequestInit = {}
) => {
  const token = await getValidToken();

  const res = await fetch(input, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  // 🔁 Token inválido → reintenta
  if (res.status === 401) {
    localStorage.clear();
    const newToken = await getValidToken();

    return fetch(input, {
      ...init,
      headers: {
        ...(init.headers || {}),
        Authorization: `Bearer ${newToken}`,
      },
    });
  }

  return res;
};
