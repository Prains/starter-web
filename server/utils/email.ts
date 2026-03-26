import nodemailer from "nodemailer";

import {
  getAuthRuntimeConfigDefaults,
  parseAuthEnv,
} from "../../shared/auth-env";

type AuthEmailEnv = Record<string, string | undefined>;
type AuthEmailLogger = {
  info(message: string): void;
};
type MailTransport = {
  sendMail(input: {
    to: string;
    from: string;
    subject: string;
    text: string;
  }): Promise<void>;
};
type CreateTransport = (options: {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
}) => MailTransport;

export type AuthEmailHandlers = {
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

function formatLogMessage(
  kind: "verification" | "reset" | "magic-link",
  recipient: string,
  url: string,
): string {
  return `[auth:${kind}] ${recipient} -> ${url}`;
}

export function createAuthEmailHandlers(options?: {
  env?: AuthEmailEnv;
  logger?: AuthEmailLogger;
  createTransport?: CreateTransport;
}): AuthEmailHandlers {
  const rawEnv = options?.env ?? process.env;
  const runtimeConfig = getAuthRuntimeConfigDefaults(rawEnv);
  const authEnv = parseAuthEnv(runtimeConfig, {
    nodeEnv: rawEnv.NODE_ENV,
  });
  const logger = options?.logger ?? console;

  if (authEnv.authEmailMode === "log") {
    return {
      sendVerificationEmail: async ({ user, url }) => {
        logger.info(
          formatLogMessage(
            "verification",
            user.email,
            url,
          ),
        );
      },
      sendResetPassword: async ({ user, url }) => {
        logger.info(formatLogMessage("reset", user.email, url));
      },
      sendMagicLink: async ({ email, url }) => {
        logger.info(formatLogMessage("magic-link", email, url));
      },
    };
  }

  const smtpConfig = authEnv.smtp;

  if (!smtpConfig) {
    throw new Error("SMTP transport requires parsed SMTP configuration.");
  }

  const createTransport = options?.createTransport ?? nodemailer.createTransport;
  const transport = createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass,
    },
  });
  const from = smtpConfig.from;

  return {
    sendVerificationEmail: async ({ user, url }) => {
      await transport.sendMail({
        to: user.email,
        from,
        subject: "Verify your email",
        text: `Verify your email by opening this link: ${url}`,
      });
    },
    sendResetPassword: async ({ user, url }) => {
      await transport.sendMail({
        to: user.email,
        from,
        subject: "Reset your password",
        text: `Reset your password by opening this link: ${url}`,
      });
    },
    sendMagicLink: async ({ email, url }) => {
      await transport.sendMail({
        to: email,
        from,
        subject: "Your sign-in link",
        text: `Sign in with this magic link: ${url}`,
      });
    },
  };
}
