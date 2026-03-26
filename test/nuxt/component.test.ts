import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(import.meta.dirname, "../..");
const indexPage = readFileSync(path.join(repoRoot, "app/pages/index.vue"), "utf8");

describe("starter homepage", () => {
  it("keeps a single NuxtWelcome-based page with starter guidance", () => {
    expect(indexPage).toContain("Plancy starter");
    expect(indexPage).toContain("NuxtWelcome");
    expect(indexPage).toContain("DATABASE_URL");
    expect(indexPage).toContain("Prisma");
    expect(indexPage).toContain("Better Auth");
    expect(indexPage).toContain("oRPC");
  });
});
