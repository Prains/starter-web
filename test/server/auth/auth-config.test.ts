import { afterEach, describe, expect, it, vi } from "vitest";

type AuthEmailHandlers = {
  sendVerificationEmail(input: {
    user: {
      email: string;
      name: string;
    };
    url: string;
    token: string;
  }): Promise<void>;
  sendResetPassword(input: {
    user: {
      email: string;
      name: string;
    };
    url: string;
    token: string;
  }): Promise<void>;
  sendMagicLink(input: {
    email: string;
    url: string;
    token: string;
  }): Promise<void>;
};

type AuthModule = {
  auth: {
    api: Record<string, unknown>;
  };
};

type EmailModule = {
  createAuthEmailHandlers(options?: {
    env?: Record<string, string | undefined>;
    logger?: {
      info(message: string): void;
    };
    createTransport?: (options: {
      host: string;
      port: number;
      auth: {
        user: string;
        pass: string;
      };
    }) => {
      sendMail(input: {
        to: string;
        from: string;
        subject: string;
        text: string;
      }): Promise<void>;
    };
  }): AuthEmailHandlers;
};

function getBaseAuthEnv(): Record<string, string> {
  return {
    DATABASE_URL:
      "postgresql://postgres:postgres@127.0.0.1:54329/starter_web_task2?schema=public",
    BETTER_AUTH_SECRET: "better-auth-secret-that-is-long-enough-for-tests",
    BETTER_AUTH_URL: "http://localhost:3000",
    AUTH_EMAIL_MODE: "log",
    SMTP_HOST: "smtp.example.com",
    SMTP_PORT: "587",
    SMTP_USER: "smtp-user",
    SMTP_PASS: "smtp-pass",
    SMTP_FROM: "Starter Web <hello@example.com>",
  };
}

async function loadAuthModule(): Promise<AuthModule> {
  vi.resetModules();

  return (await import("../../../server/utils/auth.ts")) as AuthModule;
}

async function loadEmailModule(): Promise<EmailModule> {
  vi.resetModules();

  return (await import("../../../server/utils/email.ts")) as EmailModule;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("better auth server config", () => {
  it("wires login/register/reset/verify/magic-link handlers", async () => {
    for (const [key, value] of Object.entries(getBaseAuthEnv())) {
      vi.stubEnv(key, value);
    }

    const { auth } = await loadAuthModule();

    expect(auth.api.signInEmail).toBeTypeOf("function");
    expect(auth.api.signUpEmail).toBeTypeOf("function");
    expect(auth.api.requestPasswordReset).toBeTypeOf("function");
    expect(auth.api.resetPassword).toBeTypeOf("function");
    expect(auth.api.sendVerificationEmail).toBeTypeOf("function");
    expect(auth.api.signInMagicLink).toBeTypeOf("function");
    expect(auth.api.magicLinkVerify).toBeTypeOf("function");
  });

  it("logs verification, reset, and magic-link urls in AUTH_EMAIL_MODE=log", async () => {
    const logger = {
      info: vi.fn(),
    };
    const { createAuthEmailHandlers } = await loadEmailModule();
    const emailHandlers = createAuthEmailHandlers({
      env: getBaseAuthEnv(),
      logger,
    });

    await emailHandlers.sendVerificationEmail({
      user: {
        email: "verify@example.com",
        name: "Verify User",
      },
      url: "https://example.com/verify-email?token=verify-token",
      token: "verify-token",
    });
    await emailHandlers.sendResetPassword({
      user: {
        email: "reset@example.com",
        name: "Reset User",
      },
      url: "https://example.com/reset-password?token=reset-token",
      token: "reset-token",
    });
    await emailHandlers.sendMagicLink({
      email: "magic@example.com",
      url: "https://example.com/magic-link?token=magic-token",
      token: "magic-token",
    });

    expect(logger.info).toHaveBeenCalledTimes(3);
    expect(logger.info).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("https://example.com/verify-email?token=verify-token"),
    );
    expect(logger.info).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("https://example.com/reset-password?token=reset-token"),
    );
    expect(logger.info).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining("https://example.com/magic-link?token=magic-token"),
    );
  });

  it("requires SMTP transport config when AUTH_EMAIL_MODE=smtp", async () => {
    const { createAuthEmailHandlers } = await loadEmailModule();
    const smtpEnv = getBaseAuthEnv();

    expect(() =>
      createAuthEmailHandlers({
        env: {
          ...smtpEnv,
          AUTH_EMAIL_MODE: "smtp",
          SMTP_HOST: undefined,
        },
      }),
    ).toThrow(/SMTP_HOST|SMTP_PORT|SMTP_USER|SMTP_PASS|SMTP_FROM/);
  });
});
