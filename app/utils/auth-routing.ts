import {
  DEFAULT_APP_REDIRECT,
  buildLoginRedirect,
  sanitizeAppRedirect,
} from "../../shared/auth-routes";

export { buildLoginRedirect, sanitizeAppRedirect };

export const hasActiveSession = (session: unknown): boolean => {
  if (!session || typeof session !== "object") {
    return false;
  }

  if ("data" in session) {
    return hasActiveSession((session as { data?: unknown }).data);
  }

  const payload = session as {
    session?: unknown;
    user?: unknown;
  };

  return Boolean(payload.session && payload.user);
};

export const resolveProtectedRedirect = (
  path: string,
  session: unknown,
) => {
  if (hasActiveSession(session)) {
    return null;
  }

  return buildLoginRedirect(path);
};

export const resolveAuthPageRedirect = (session: unknown) => {
  if (!hasActiveSession(session)) {
    return null;
  }

  return DEFAULT_APP_REDIRECT;
};
