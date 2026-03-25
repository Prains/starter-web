import { describe, expect, it, vi } from "vitest";

import {
  submitLogin,
  submitRegistration,
} from "../../../app/utils/auth-pages";

describe("auth page actions", () => {
  it("keeps the user on login with an inline error for wrong credentials", async () => {
    const signInEmail = vi
      .fn()
      .mockRejectedValue(new Error("Invalid email or password"));

    const result = await submitLogin(
      {
        signIn: {
          email: signInEmail,
        },
      },
      {
        email: "demo@example.com",
        password: "WrongPassword123!",
      },
      "/app/notes",
    );

    expect(signInEmail).toHaveBeenCalledWith({
      email: "demo@example.com",
      password: "WrongPassword123!",
      callbackURL: "/app/notes",
      rememberMe: true,
    });
    expect(result).toEqual({
      ok: false,
      errorMessage: "Invalid email or password",
    });
  });

  it("keeps the user on register with inline validation feedback for duplicate users", async () => {
    const signUpEmail = vi.fn().mockResolvedValue({
      error: {
        message: "An account with this email already exists",
      },
    });

    const result = await submitRegistration(
      {
        signUp: {
          email: signUpEmail,
        },
      },
      {
        name: "Demo User",
        email: "demo@example.com",
        password: "DemoPassword123!",
      },
      "/app/notes",
      "http://localhost:3000",
    );

    expect(signUpEmail).toHaveBeenCalledWith({
      name: "Demo User",
      email: "demo@example.com",
      password: "DemoPassword123!",
      callbackURL: "http://localhost:3000/auth/verify?redirect=%2Fapp%2Fnotes",
    });
    expect(result).toEqual({
      ok: false,
      errorMessage: "An account with this email already exists",
    });
  });

  it("respects the sanitized redirect target after a successful sign-in", async () => {
    const signInEmail = vi.fn().mockResolvedValue({
      data: {
        user: {
          id: "user_1",
        },
      },
    });

    const result = await submitLogin(
      {
        signIn: {
          email: signInEmail,
        },
      },
      {
        email: "demo@example.com",
        password: "DemoPassword123!",
      },
      "https://evil.test/steal-session",
    );

    expect(signInEmail).toHaveBeenCalledWith({
      email: "demo@example.com",
      password: "DemoPassword123!",
      callbackURL: "/app",
      rememberMe: true,
    });
    expect(result).toEqual({
      ok: true,
      redirectTo: "/app",
    });
  });
});
