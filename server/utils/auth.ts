import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins/magic-link";

import { prisma } from "../../prisma/client";
import { getAuthRuntimeConfigDefaults } from "../../shared/auth-env";
import { createAuthEmailHandlers } from "./email";

function getTrustedOrigins(baseUrl: string | undefined): string[] | undefined {
  if (!baseUrl) {
    return undefined;
  }

  return [new URL(baseUrl).origin];
}

export function createAuth() {
  const runtimeConfig = getAuthRuntimeConfigDefaults(process.env);
  const emailHandlers = createAuthEmailHandlers();

  return betterAuth({
    secret: runtimeConfig.BETTER_AUTH_SECRET,
    baseURL: runtimeConfig.BETTER_AUTH_URL,
    basePath: "/api/auth",
    trustedOrigins: getTrustedOrigins(runtimeConfig.BETTER_AUTH_URL),
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: emailHandlers.sendResetPassword,
    },
    emailVerification: {
      sendOnSignUp: true,
      sendVerificationEmail: emailHandlers.sendVerificationEmail,
    },
    plugins: [
      magicLink({
        sendMagicLink: emailHandlers.sendMagicLink,
      }),
    ],
  });
}

export const auth = createAuth();
