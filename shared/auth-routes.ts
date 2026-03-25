export const DEFAULT_APP_REDIRECT = "/app";

const AUTH_BASE_ORIGIN = "http://starter.local";

type AuthPageOptions = {
  error?: string | null | undefined;
  redirect?: string | null | undefined;
  token?: string | null | undefined;
};

const isAbsoluteUrl = (value: string) =>
  /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value);

const isAppPath = (pathname: string) =>
  pathname === DEFAULT_APP_REDIRECT || pathname.startsWith("/app/");

const buildQueryString = (query: URLSearchParams) => {
  const search = query.toString();

  return search ? `?${search}` : "";
};

export const sanitizeAppRedirect = (value?: string | null | undefined) => {
  if (!value) {
    return DEFAULT_APP_REDIRECT;
  }

  try {
    const url = new URL(value, AUTH_BASE_ORIGIN);

    if (url.origin !== AUTH_BASE_ORIGIN || !isAppPath(url.pathname)) {
      return DEFAULT_APP_REDIRECT;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DEFAULT_APP_REDIRECT;
  }
};

export const buildLoginRedirect = (value?: string | null | undefined) => {
  const redirect = sanitizeAppRedirect(value);

  return `/auth/login?redirect=${encodeURIComponent(redirect)}`;
};

const buildAuthPagePath = (pathname: string, options: AuthPageOptions = {}) => {
  const searchParams = new URLSearchParams();

  if (options.token) {
    searchParams.set("token", options.token);
  }

  if (options.error) {
    searchParams.set("error", options.error);
  }

  searchParams.set("redirect", sanitizeAppRedirect(options.redirect));

  return `${pathname}${buildQueryString(searchParams)}`;
};

export const buildResetPagePath = (options: AuthPageOptions = {}) =>
  buildAuthPagePath("/auth/reset", options);

export const buildVerifyPagePath = (options: AuthPageOptions = {}) =>
  buildAuthPagePath("/auth/verify", options);

export const buildMagicLinkPagePath = (options: AuthPageOptions = {}) =>
  buildAuthPagePath("/auth/magic-link", options);

export const buildAbsoluteUrl = (origin: string, path: string) =>
  new URL(path, origin).toString();

export const appendQueryParams = (
  target: string,
  params: Record<string, string | null | undefined>,
) => {
  const absoluteTarget = isAbsoluteUrl(target)
    ? new URL(target)
    : new URL(target, AUTH_BASE_ORIGIN);

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      absoluteTarget.searchParams.set(key, value);
    }
  }

  if (isAbsoluteUrl(target)) {
    return absoluteTarget.toString();
  }

  return `${absoluteTarget.pathname}${absoluteTarget.search}${absoluteTarget.hash}`;
};

export const extractCallbackUrl = (
  rawUrl: string,
  key: "callbackURL" | "errorCallbackURL" = "callbackURL",
) => {
  try {
    const url = new URL(rawUrl);

    return url.searchParams.get(key);
  } catch {
    return null;
  }
};

export const buildStarterEmailLink = (rawUrl: string, token: string) => {
  const callbackUrl = extractCallbackUrl(rawUrl);

  if (!callbackUrl) {
    return rawUrl;
  }

  return appendQueryParams(callbackUrl, { token });
};
