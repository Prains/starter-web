import { z } from "zod";

const authEmailModeSchema = z.enum(["log", "smtp"]);
const smtpConfigSchema = z.object({
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_FROM: z.string().min(1),
});

export type AuthEmailMode = z.infer<typeof authEmailModeSchema>;
export type AuthEnv = {
  authEmailMode: AuthEmailMode;
  smtp:
    | {
        host: string;
        port: number;
        user: string;
        pass: string;
        from: string;
      }
    | null;
};

export type AuthRuntimeConfig = {
  BETTER_AUTH_SECRET: string | undefined;
  BETTER_AUTH_URL: string | undefined;
  AUTH_EMAIL_MODE: string | undefined;
  SMTP_HOST: string | undefined;
  SMTP_PORT: string | undefined;
  SMTP_USER: string | undefined;
  SMTP_PASS: string | undefined;
  SMTP_FROM: string | undefined;
};

export function getAuthRuntimeConfigDefaults(
  rawEnv: Record<string, string | undefined>,
): AuthRuntimeConfig {
  return {
    BETTER_AUTH_SECRET:
      rawEnv.NUXT_BETTER_AUTH_SECRET ?? rawEnv.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: rawEnv.NUXT_BETTER_AUTH_URL ?? rawEnv.BETTER_AUTH_URL,
    AUTH_EMAIL_MODE: rawEnv.NUXT_AUTH_EMAIL_MODE ?? rawEnv.AUTH_EMAIL_MODE,
    SMTP_HOST: rawEnv.NUXT_SMTP_HOST ?? rawEnv.SMTP_HOST,
    SMTP_PORT: rawEnv.NUXT_SMTP_PORT ?? rawEnv.SMTP_PORT,
    SMTP_USER: rawEnv.NUXT_SMTP_USER ?? rawEnv.SMTP_USER,
    SMTP_PASS: rawEnv.NUXT_SMTP_PASS ?? rawEnv.SMTP_PASS,
    SMTP_FROM: rawEnv.NUXT_SMTP_FROM ?? rawEnv.SMTP_FROM,
  };
}

export function parseAuthEnv(
  rawEnv: Record<string, string | undefined>,
  options?: {
    nodeEnv?: string;
  },
): AuthEnv {
  const authEmailMode = authEmailModeSchema.parse(
    rawEnv.AUTH_EMAIL_MODE ?? "log",
  );
  const nodeEnv = options?.nodeEnv ?? rawEnv.NODE_ENV ?? "development";

  if (nodeEnv === "production" && authEmailMode === "log") {
    throw new Error(
      "AUTH_EMAIL_MODE=log is not allowed for production startup. Configure SMTP before deploying.",
    );
  }

  if (authEmailMode === "log") {
    return {
      authEmailMode,
      smtp: null,
    };
  }

  const smtpConfig = smtpConfigSchema.parse(rawEnv);

  return {
    authEmailMode,
    smtp: {
      host: smtpConfig.SMTP_HOST,
      port: smtpConfig.SMTP_PORT,
      user: smtpConfig.SMTP_USER,
      pass: smtpConfig.SMTP_PASS,
      from: smtpConfig.SMTP_FROM,
    },
  };
}
