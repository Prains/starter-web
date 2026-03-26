import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(import.meta.dirname, "../..");
const environmentExample = readFileSync(path.join(repoRoot, ".env.example"), "utf8");

describe("starter env contract", () => {
  it("keeps local bootstrap centered on DATABASE_URL", () => {
    expect(environmentExample).toContain("DATABASE_URL=");
    expect(environmentExample).toContain("BETTER_AUTH_URL=http://localhost:3000");
    expect(environmentExample).toContain("AUTH_EMAIL_MODE=log");
    expect(environmentExample).toContain("BETTER_AUTH_SECRET=");
  });

  it("does not ship real secrets or production endpoints", () => {
    expect(environmentExample).not.toMatch(/postgres:\/\/[^<\n]+/i);
    expect(environmentExample).not.toMatch(/sk-or-v1-/i);
    expect(environmentExample).not.toMatch(/smtp\./i);
  });
});
