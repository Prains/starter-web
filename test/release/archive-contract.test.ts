import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildReleaseArchive } from "../../scripts/build-release-archive";
import { verifyReleaseArchive } from "../../scripts/verify-release-archive";
import { createReleaseArchiveFixture } from "./archive-fixtures";

describe("starter release archive contract", () => {
  it("rejects archives without starter.manifest.json at the archive root", async () => {
    const fixture = createReleaseArchiveFixture({
      omitFiles: ["starter.manifest.json"],
    });

    try {
      await expect(
        verifyReleaseArchive({ archivePath: fixture.archivePath }),
      ).rejects.toThrow(/starter\.manifest\.json/i);
    } finally {
      fixture.cleanup();
    }
  });

  it("rejects archives that expand into a nested top-level directory", async () => {
    const fixture = createReleaseArchiveFixture({
      nestedRootDirectory: "starter-web",
    });

    try {
      await expect(
        verifyReleaseArchive({ archivePath: fixture.archivePath }),
      ).rejects.toThrow(/nested/i);
    } finally {
      fixture.cleanup();
    }
  });

  it("rejects archives when a manifest-listed file is missing", async () => {
    const fixture = createReleaseArchiveFixture({
      omitFiles: ["app/app.config.ts"],
    });

    try {
      await expect(
        verifyReleaseArchive({ archivePath: fixture.archivePath }),
      ).rejects.toThrow(/app\/app\.config\.ts/i);
    } finally {
      fixture.cleanup();
    }
  });

  it("rejects archives when .env.example is missing but copyEnvExampleToEnv is enabled", async () => {
    const fixture = createReleaseArchiveFixture({
      omitFiles: [".env.example"],
    });

    try {
      await expect(
        verifyReleaseArchive({ archivePath: fixture.archivePath }),
      ).rejects.toThrow(/\.env\.example/i);
    } finally {
      fixture.cleanup();
    }
  });

  it("rejects archives whose asset file name does not match the starter version", async () => {
    const fixture = createReleaseArchiveFixture({
      assetName: "starter-web.tar.gz",
    });

    try {
      await expect(
        verifyReleaseArchive({ archivePath: fixture.archivePath }),
      ).rejects.toThrow(/starter-web-v\d+\.\d+\.\d+\.tar\.gz/i);
    } finally {
      fixture.cleanup();
    }
  });

  it("omits local-only and secret paths from built archives", () => {
    const repoRoot = mkdtempSync(path.join(os.tmpdir(), "starter-release-build-"));

    try {
      writeFileSync(
        path.join(repoRoot, "package.json"),
        JSON.stringify({ name: "__PACKAGE_NAME__", version: "0.1.0" }, null, 2),
      );
      writeFileSync(
        path.join(repoRoot, "starter.manifest.json"),
        JSON.stringify(
          {
            schemaVersion: 1,
            templateVersion: "0.1.0",
            packageNameToken: "__PACKAGE_NAME__",
            appNameToken: "__APP_NAME__",
            packageNameFiles: ["package.json"],
            appNameFiles: ["README.md", "app/app.config.ts"],
            copyEnvExampleToEnv: true,
            defaultGitInit: true,
          },
          null,
          2,
        ),
      );
      writeFileSync(path.join(repoRoot, "nuxt.config.ts"), "export default defineNuxtConfig({});\n");
      writeFileSync(path.join(repoRoot, ".env.example"), "DATABASE_URL=\n");
      writeFileSync(path.join(repoRoot, "README.md"), "# __APP_NAME__\n");
      mkdirSync(path.join(repoRoot, "app"), { recursive: true });
      writeFileSync(
        path.join(repoRoot, "app/app.config.ts"),
        "export default defineAppConfig({ appName: '__APP_NAME__' });\n",
      );

      execFileSync("git", ["init", "-b", "develop"], { cwd: repoRoot });
      execFileSync("git", ["config", "user.name", "starter-test"], { cwd: repoRoot });
      execFileSync("git", ["config", "user.email", "starter-test@example.com"], {
        cwd: repoRoot,
      });
      execFileSync(
        "git",
        [
          "add",
          "package.json",
          "starter.manifest.json",
          "nuxt.config.ts",
          ".env.example",
          "README.md",
          "app/app.config.ts",
        ],
        { cwd: repoRoot },
      );

      mkdirSync(path.join(repoRoot, "node_modules/demo"), { recursive: true });
      writeFileSync(path.join(repoRoot, "node_modules/demo/index.js"), "ignored\n");
      mkdirSync(path.join(repoRoot, ".output/server"), { recursive: true });
      writeFileSync(path.join(repoRoot, ".output/server/index.mjs"), "ignored\n");
      mkdirSync(path.join(repoRoot, ".context"), { recursive: true });
      writeFileSync(path.join(repoRoot, ".context/note.txt"), "ignored\n");
      writeFileSync(path.join(repoRoot, ".env"), "TOP_SECRET=1\n");
      writeFileSync(path.join(repoRoot, ".env.local"), "TOP_SECRET_LOCAL=1\n");
      writeFileSync(path.join(repoRoot, "local-secret.txt"), "SHOULD_NOT_SHIP\n");

      const archivePath = buildReleaseArchive({ repoRoot });
      const archiveListing = execFileSync("/usr/bin/tar", ["-tzf", archivePath], {
        encoding: "utf8",
      });

      expect(archiveListing).not.toMatch(/(^|\n)\.\/\.env(\n|$)/);
      expect(archiveListing).not.toMatch(/(^|\n)(?:\.\/)?\.env\.local(\n|$)/);
      expect(archiveListing).not.toMatch(/(^|\n)\.\/node_modules\//);
      expect(archiveListing).not.toMatch(/(^|\n)\.\/\.output\//);
      expect(archiveListing).not.toMatch(/(^|\n)\.\/\.context\//);
      expect(archiveListing).not.toMatch(/(^|\n)(?:\.\/)?local-secret\.txt(\n|$)/);
      expect(archiveListing).toMatch(/(^|\n)(?:\.\/)?starter\.manifest\.json(\n|$)/);
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});
