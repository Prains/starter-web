import { describe, expect, it } from "vitest";
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
});
