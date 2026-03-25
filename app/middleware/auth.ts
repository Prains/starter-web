import { fetchCurrentAuthSession } from "../utils/auth-session";
import { resolveProtectedRedirect } from "../utils/auth-routing";

export default defineNuxtRouteMiddleware(async (to) => {
  const redirectTo = resolveProtectedRedirect(
    to.fullPath,
    await fetchCurrentAuthSession(),
  );

  if (redirectTo) {
    return navigateTo(redirectTo, { replace: true });
  }
});
