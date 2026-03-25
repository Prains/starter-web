import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("auth client wrapper", () => {
  it("exposes Better Auth client methods plus session helpers", async () => {
    vi.stubEnv("BETTER_AUTH_URL", "http://localhost:3000");

    const authClientModule = await import("../../app/utils/auth-client");

    expect(typeof authClientModule.authClient.signIn.email).toBe("function");
    expect(typeof authClientModule.authClient.signUp.email).toBe("function");
    expect(typeof authClientModule.authClient.requestPasswordReset).toBe(
      "function",
    );
    expect(typeof authClientModule.authClient.resetPassword).toBe("function");
    expect(typeof authClientModule.authClient.sendVerificationEmail).toBe(
      "function",
    );
    expect(typeof authClientModule.authClient.signIn.magicLink).toBe("function");
    expect(typeof authClientModule.authClient.magicLink.verify).toBe(
      "function",
    );
    expect(typeof authClientModule.useAuthSession).toBe("function");
    expect(typeof authClientModule.getAuthSession).toBe("function");
  });
});
