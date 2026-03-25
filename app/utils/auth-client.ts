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

export const useAuthSession = () => authClient.useSession();

export const getAuthSession = () => authClient.getSession();
