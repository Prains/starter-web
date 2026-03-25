import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(import.meta.dirname, "../..");
const packageJsonPath = path.join(repoRoot, "package.json");
const manifestPath = path.join(repoRoot, "starter.manifest.json");
const nuxtConfigPath = path.join(repoRoot, "nuxt.config.ts");
const environmentExamplePath = path.join(repoRoot, ".env.example");

type StarterManifest = {
  schemaVersion: number;
  templateVersion: string;
  packageNameToken: string;
  appNameToken: string;
  packageNameFiles: string[];
  appNameFiles: string[];
  copyEnvExampleToEnv: boolean;
  defaultGitInit: boolean;
};

function readStarterManifest(): StarterManifest {
  return JSON.parse(readFileSync(manifestPath, "utf8")) as StarterManifest;
}

function readRepoFile(relativePath: string): string {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

describe("starter manifest contract", () => {
  it("pins manifest location, file inventory, and token locations", () => {
    expect(existsSync(manifestPath)).toBe(true);
    expect(existsSync(packageJsonPath)).toBe(true);
    expect(existsSync(nuxtConfigPath)).toBe(true);
    expect(existsSync(environmentExamplePath)).toBe(true);

    const manifest = readStarterManifest();
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
      version?: string;
    };
    const replacementFiles = [
      ...manifest.packageNameFiles,
      ...manifest.appNameFiles,
    ];

    for (const relativePath of replacementFiles) {
      expect(existsSync(path.join(repoRoot, relativePath))).toBe(true);
    }

    expect(manifest.packageNameToken).toBe("__PACKAGE_NAME__");
    expect(manifest.appNameToken).toBe("__APP_NAME__");
    expect(manifest.copyEnvExampleToEnv).toBe(true);
    expect(manifest.defaultGitInit).toBe(true);
    expect(manifest.templateVersion).toBe(packageJson.version);

    for (const relativePath of manifest.packageNameFiles) {
      expect(readRepoFile(relativePath)).toContain(manifest.packageNameToken);
    }

    for (const relativePath of manifest.appNameFiles) {
      expect(readRepoFile(relativePath)).toContain(manifest.appNameToken);
    }
  });
});
