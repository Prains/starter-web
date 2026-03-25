import { parseAuthEnv } from "../../shared/auth-env";

export default defineNitroPlugin(() => {
  const runtimeConfig = useRuntimeConfig();

  parseAuthEnv(
    {
      AUTH_EMAIL_MODE: runtimeConfig.AUTH_EMAIL_MODE,
      SMTP_HOST: runtimeConfig.SMTP_HOST,
      SMTP_PORT: runtimeConfig.SMTP_PORT,
      SMTP_USER: runtimeConfig.SMTP_USER,
      SMTP_PASS: runtimeConfig.SMTP_PASS,
      SMTP_FROM: runtimeConfig.SMTP_FROM,
    },
    {
      nodeEnv: process.env.NODE_ENV,
    },
  );
});
