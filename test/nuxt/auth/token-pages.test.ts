import { describe, expect, it, vi } from "vitest";

import {
  buildMagicLinkVerificationUrl,
  completeEmailVerification,
  completePasswordReset,
  resolveMagicLinkPageState,
  resolveResetPageState,
  resolveVerificationPageState,
} from "../../../app/utils/auth-pages";

describe("auth token completion helpers", () => {
  it("renders reset retry state for invalid or expired tokens", async () => {
    const resetPassword = vi.fn().mockResolvedValue({
      error: {
        message: "Invalid reset token",
      },
    });

    const result = await completePasswordReset(
      {
        resetPassword,
      },
      {
        token: "bad-token",
        newPassword: "DemoPassword123!",
      },
      "/app/notes",
    );

    expect(result).toEqual({
      ok: false,
      page: "reset",
      errorMessage: "Invalid reset token",
      ctaLabel: "Request a fresh link",
    });
    expect(resolveResetPageState("INVALID_TOKEN")).toEqual({
      status: "invalid",
      ctaLabel: "Request a fresh link",
    });
  });

  it("renders resend verification state for invalid tokens", () => {
    expect(resolveVerificationPageState("INVALID_TOKEN")).toEqual({
      status: "invalid",
      ctaLabel: "Resend verification",
    });
  });

  it("renders a back-to-login state for invalid magic-link tokens", () => {
    expect(resolveMagicLinkPageState("INVALID_TOKEN")).toEqual({
      status: "invalid",
      ctaLabel: "Back to login",
      ctaTo: "/auth/login",
    });
  });

  it("respects the sanitized redirect target after successful verification", async () => {
    const verifyEmail = vi.fn().mockResolvedValue({
      data: {
        status: true,
      },
    });

    const result = await completeEmailVerification(
      {
        verifyEmail,
      },
      "verify-token",
      "https://evil.test/payload",
    );

    expect(verifyEmail).toHaveBeenCalledWith({
      query: {
        token: "verify-token",
      },
    });
    expect(result).toEqual({
      ok: true,
      redirectTo: "/app",
    });
  });

  it("builds magic-link verification URLs with a sanitized redirect target", () => {
    expect(
      buildMagicLinkVerificationUrl("magic-token", "https://evil.test/payload"),
    ).toBe(
      "/api/auth/magic-link/verify?token=magic-token&callbackURL=%2Fapp&errorCallbackURL=%2Fauth%2Fmagic-link%3Fredirect%3D%252Fapp",
    );
  });
});
