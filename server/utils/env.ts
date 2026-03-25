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
