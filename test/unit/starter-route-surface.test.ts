import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(import.meta.dirname, "../..");
const appPagesDirectory = path.join(repoRoot, "app/pages");
const appMiddlewareDirectory = path.join(repoRoot, "app/middleware");

function collectFiles(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectFiles(absolutePath);
    }

    return statSync(absolutePath).isFile()
      ? [path.relative(repoRoot, absolutePath).replaceAll(path.sep, "/")]
      : [];
  });
}

describe("starter route surface", () => {
  it("ships only the root page from app/pages", () => {
    expect(collectFiles(appPagesDirectory)).toEqual(["app/pages/index.vue"]);
  });

  it("does not ship root app middleware", () => {
    expect(collectFiles(appMiddlewareDirectory)).toEqual([]);
  });
});
