import {
  buildAbsoluteUrl,
  buildMagicLinkPagePath,
  buildResetPagePath,
  buildVerifyPagePath,
  sanitizeAppRedirect,
} from "../../shared/auth-routes";

type AuthErrorLike = {
  message?: string | undefined;
};

type AuthResponseLike = {
  error?: AuthErrorLike | null | undefined;
};

type LoginClient = {
  signIn: {
    email: (input: {
      callbackURL: string;
      email: string;
      password: string;
      rememberMe: boolean;
    }) => Promise<unknown>;
  };
};

type RegisterClient = {
  signUp: {
    email: (input: {
      callbackURL: string;
      email: string;
      name: string;
      password: string;
    }) => Promise<unknown>;
  };
};

type PasswordResetClient = {
  requestPasswordReset?: (input: {
    email: string;
    redirectTo: string;
  }) => Promise<unknown>;
  resetPassword: (input: {
    newPassword: string;
    token: string;
  }) => Promise<unknown>;
};

type VerificationClient = {
  sendVerificationEmail?: (input: {
    callbackURL: string;
    email: string;
  }) => Promise<unknown>;
  verifyEmail: (input: {
    query: {
      token: string;
    };
  }) => Promise<unknown>;
};

type MagicLinkClient = {
  signIn: {
    magicLink: (input: {
      callbackURL: string;
      email: string;
      errorCallbackURL: string;
    }) => Promise<unknown>;
  };
};

const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallbackMessage;
};

const getResponseError = (result: unknown) => {
  if (!result || typeof result !== "object" || !("error" in result)) {
    return null;
  }

  const { error } = result as AuthResponseLike;

  if (!error) {
    return null;
  }

  return getErrorMessage(error, "Authentication failed");
};

const isInvalidTokenMessage = (message: string) =>
  /token|expired|invalid/i.test(message);

export const submitLogin = async (
  authClient: LoginClient,
  input: {
    email: string;
    password: string;
  },
  redirectTarget?: string | null | undefined,
) => {
  const callbackURL = sanitizeAppRedirect(redirectTarget);

  try {
    const result = await authClient.signIn.email({
      email: input.email,
      password: input.password,
      callbackURL,
      rememberMe: true,
    });

    const errorMessage = getResponseError(result);

    if (errorMessage) {
      return {
        ok: false as const,
        errorMessage,
      };
    }

    return {
      ok: true as const,
      redirectTo: callbackURL,
    };
  } catch (error) {
    return {
      ok: false as const,
      errorMessage: getErrorMessage(error, "Unable to sign in"),
    };
  }
};

export const submitRegistration = async (
  authClient: RegisterClient,
  input: {
    email: string;
    name: string;
    password: string;
  },
  redirectTarget: string | null | undefined,
  origin: string,
) => {
  const callbackURL = buildAbsoluteUrl(
    origin,
    buildVerifyPagePath({ redirect: redirectTarget }),
  );

  try {
    const result = await authClient.signUp.email({
      name: input.name,
      email: input.email,
      password: input.password,
      callbackURL,
    });

    const errorMessage = getResponseError(result);

    if (errorMessage) {
      return {
        ok: false as const,
        errorMessage,
      };
    }

    return {
      ok: true as const,
      noticeMessage: "Check your inbox for the verification link.",
    };
  } catch (error) {
    return {
      ok: false as const,
      errorMessage: getErrorMessage(error, "Unable to create your account"),
    };
  }
};

export const requestPasswordResetLink = async (
  authClient: Pick<PasswordResetClient, "requestPasswordReset">,
  email: string,
  redirectTarget: string | null | undefined,
  origin: string,
) => {
  if (!authClient.requestPasswordReset) {
    return {
      ok: false as const,
      errorMessage: "Password reset is not available",
    };
  }

  try {
    const result = await authClient.requestPasswordReset({
      email,
      redirectTo: buildAbsoluteUrl(
        origin,
        buildResetPagePath({ redirect: redirectTarget }),
      ),
    });

    const errorMessage = getResponseError(result);

    if (errorMessage) {
      return {
        ok: false as const,
        errorMessage,
      };
    }

    return {
      ok: true as const,
      noticeMessage: "If the account exists, a reset link is on the way.",
    };
  } catch (error) {
    return {
      ok: false as const,
      errorMessage: getErrorMessage(error, "Unable to request a reset link"),
    };
  }
};

export const completePasswordReset = async (
  authClient: Pick<PasswordResetClient, "resetPassword">,
  input: {
    newPassword: string;
    token: string;
  },
  redirectTarget: string | null | undefined,
) => {
  try {
    const result = await authClient.resetPassword({
      token: input.token,
      newPassword: input.newPassword,
    });

    const errorMessage = getResponseError(result);

    if (errorMessage) {
      return {
        ok: false as const,
        page: "reset" as const,
        errorMessage,
        ctaLabel: isInvalidTokenMessage(errorMessage)
          ? "Request a fresh link"
          : undefined,
      };
    }

    return {
      ok: true as const,
      redirectTo: sanitizeAppRedirect(redirectTarget),
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error, "Unable to reset password");

    return {
      ok: false as const,
      page: "reset" as const,
      errorMessage,
      ctaLabel: isInvalidTokenMessage(errorMessage)
        ? "Request a fresh link"
        : undefined,
    };
  }
};

export const resendVerificationEmail = async (
  authClient: Pick<VerificationClient, "sendVerificationEmail">,
  email: string,
  redirectTarget: string | null | undefined,
  origin: string,
) => {
  if (!authClient.sendVerificationEmail) {
    return {
      ok: false as const,
      errorMessage: "Verification email is not available",
    };
  }

  try {
    const result = await authClient.sendVerificationEmail({
      email,
      callbackURL: buildAbsoluteUrl(
        origin,
        buildVerifyPagePath({ redirect: redirectTarget }),
      ),
    });

    const errorMessage = getResponseError(result);

    if (errorMessage) {
      return {
        ok: false as const,
        errorMessage,
      };
    }

    return {
      ok: true as const,
      noticeMessage: "A fresh verification link is on the way.",
    };
  } catch (error) {
    return {
      ok: false as const,
      errorMessage: getErrorMessage(
        error,
        "Unable to send a verification email",
      ),
    };
  }
};

export const completeEmailVerification = async (
  authClient: Pick<VerificationClient, "verifyEmail">,
  token: string,
  redirectTarget: string | null | undefined,
) => {
  try {
    const result = await authClient.verifyEmail({
      query: {
        token,
      },
    });

    const errorMessage = getResponseError(result);

    if (errorMessage) {
      return {
        ok: false as const,
        page: "verify" as const,
        errorMessage,
        ctaLabel: isInvalidTokenMessage(errorMessage)
          ? "Resend verification"
          : undefined,
      };
    }

    return {
      ok: true as const,
      redirectTo: sanitizeAppRedirect(redirectTarget),
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error, "Unable to verify your email");

    return {
      ok: false as const,
      page: "verify" as const,
      errorMessage,
      ctaLabel: isInvalidTokenMessage(errorMessage)
        ? "Resend verification"
        : undefined,
    };
  }
};

export const requestMagicLink = async (
  authClient: MagicLinkClient,
  email: string,
  redirectTarget: string | null | undefined,
  origin: string,
) => {
  const pagePath = buildMagicLinkPagePath({ redirect: redirectTarget });
  const callbackURL = buildAbsoluteUrl(origin, pagePath);

  try {
    const result = await authClient.signIn.magicLink({
      email,
      callbackURL,
      errorCallbackURL: callbackURL,
    });

    const errorMessage = getResponseError(result);

    if (errorMessage) {
      return {
        ok: false as const,
        errorMessage,
      };
    }

    return {
      ok: true as const,
      noticeMessage: "Check your inbox for the sign-in link.",
    };
  } catch (error) {
    return {
      ok: false as const,
      errorMessage: getErrorMessage(error, "Unable to send a magic link"),
    };
  }
};

export const buildMagicLinkVerificationUrl = (
  token: string,
  redirectTarget: string | null | undefined,
) => {
  const redirectTo = sanitizeAppRedirect(redirectTarget);
  const searchParams = new URLSearchParams({
    token,
    callbackURL: redirectTo,
    errorCallbackURL: buildMagicLinkPagePath({ redirect: redirectTo }),
  });

  return `/api/auth/magic-link/verify?${searchParams.toString()}`;
};

export const resolveResetPageState = (errorCode?: string | null | undefined) => {
  if (!errorCode) {
    return {
      status: "idle" as const,
    };
  }

  return {
    status: "invalid" as const,
    ctaLabel: "Request a fresh link",
  };
};

export const resolveVerificationPageState = (
  errorCode?: string | null | undefined,
) => {
  if (!errorCode) {
    return {
      status: "idle" as const,
    };
  }

  return {
    status: "invalid" as const,
    ctaLabel: "Resend verification",
  };
};

export const resolveMagicLinkPageState = (
  errorCode?: string | null | undefined,
) => {
  if (!errorCode) {
    return {
      status: "idle" as const,
    };
  }

  return {
    status: "invalid" as const,
    ctaLabel: "Back to login",
    ctaTo: "/auth/login",
  };
};
