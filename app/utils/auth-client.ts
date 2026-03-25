import { magicLinkClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/vue";

const authClientBaseURL = import.meta.server
  ? process.env.NUXT_BETTER_AUTH_URL ?? process.env.BETTER_AUTH_URL
  : undefined;

export const authClient = createAuthClient({
  ...(authClientBaseURL ? { baseURL: authClientBaseURL } : {}),
  basePath: "/api/auth",
  plugins: [magicLinkClient()],
});

export function useAuthSession(...args: Parameters<typeof authClient.useSession>) {
  return authClient.useSession(...args);
}

export function getAuthSession(...args: Parameters<typeof authClient.getSession>) {
  return authClient.getSession(...args);
}
