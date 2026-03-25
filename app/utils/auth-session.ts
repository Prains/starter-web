import { useRequestHeaders, useRequestURL } from "#imports";

export const fetchCurrentAuthSession = async () => {
  const requestUrl = import.meta.server
    ? new URL("/api/auth/get-session", useRequestURL()).toString()
    : "/api/auth/get-session";

  try {
    const response = await fetch(requestUrl, {
      headers: import.meta.server ? useRequestHeaders(["cookie"]) : undefined,
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as unknown;
  } catch {
    return null;
  }
};
