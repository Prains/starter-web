import { fetchCurrentAuthSession } from "../utils/auth-session";
import { resolveAuthPageRedirect } from "../utils/auth-routing";

export default defineNuxtRouteMiddleware(async () => {
  const redirectTo = resolveAuthPageRedirect(await fetchCurrentAuthSession());

  if (redirectTo) {
    return navigateTo(redirectTo, { replace: true });
  }
});
