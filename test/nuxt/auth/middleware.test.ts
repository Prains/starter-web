import { describe, expect, it } from "vitest";

import {
  buildLoginRedirect,
  resolveAuthPageRedirect,
  resolveProtectedRedirect,
  sanitizeAppRedirect,
} from "../../../app/utils/auth-routing";

const activeSession = {
  session: { id: "session_1" },
  user: { id: "user_1" },
};

describe("auth route helpers", () => {
  it("redirects guests away from protected app routes", () => {
    expect(resolveProtectedRedirect("/app", null)).toBe(
      "/auth/login?redirect=%2Fapp",
    );
    expect(resolveProtectedRedirect("/app/notes", null)).toBe(
      "/auth/login?redirect=%2Fapp%2Fnotes",
    );
  });

  it("redirects authenticated users away from auth pages", () => {
    expect(resolveAuthPageRedirect(activeSession)).toBe("/app");
  });

  it("falls back to /app for invalid redirect targets", () => {
    expect(sanitizeAppRedirect("https://evil.test/app")).toBe("/app");
    expect(sanitizeAppRedirect("//evil.test/app")).toBe("/app");
    expect(sanitizeAppRedirect("/auth/login")).toBe("/app");
    expect(sanitizeAppRedirect("/app/notes?view=board")).toBe(
      "/app/notes?view=board",
    );
  });

  it("preserves the current protected path when the session is missing", () => {
    expect(buildLoginRedirect("/app/profile?tab=security")).toBe(
      "/auth/login?redirect=%2Fapp%2Fprofile%3Ftab%3Dsecurity",
    );
    expect(
      resolveProtectedRedirect("/app/profile?tab=security", {
        session: null,
        user: null,
      }),
    ).toBe("/auth/login?redirect=%2Fapp%2Fprofile%3Ftab%3Dsecurity");
  });
});
