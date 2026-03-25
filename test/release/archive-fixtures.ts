import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

type ArchiveFixtureOptions = {
  assetName?: string;
  nestedRootDirectory?: string;
  omitFiles?: string[];
  manifestOverride?: Partial<StarterManifest>;
};

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

type ArchiveFixture = {
  archivePath: string;
  cleanup: () => void;
};
const TAR_EXECUTABLE = "/usr/bin/tar";

const DEFAULT_MANIFEST: StarterManifest = {
  schemaVersion: 1,
  templateVersion: "0.1.0",
  packageNameToken: "__PACKAGE_NAME__",
  appNameToken: "__APP_NAME__",
  packageNameFiles: ["package.json"],
  appNameFiles: ["README.md", "app/app.config.ts"],
  copyEnvExampleToEnv: true,
  defaultGitInit: true,
};

const DEFAULT_FILES = {
  "starter.manifest.json": JSON.stringify(DEFAULT_MANIFEST, null, 2),
  "package.json": JSON.stringify(
    {
      name: "__PACKAGE_NAME__",
      version: "0.1.0",
    },
    null,
    2,
  ),
  "nuxt.config.ts": "export default defineNuxtConfig({});\n",
  ".env.example": "DATABASE_URL=\n",
  "README.md": "# __APP_NAME__\n",
  "app/app.config.ts": "export default defineAppConfig({ appName: '__APP_NAME__' });\n",
};

function writeFixtureFile(rootDirectory: string, relativePath: string, contents: string): void {
  const absolutePath = path.join(rootDirectory, relativePath);

  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, contents);
}

export function createReleaseArchiveFixture(
  options: ArchiveFixtureOptions = {},
): ArchiveFixture {
  const temporaryDirectory = mkdtempSync(
    path.join(os.tmpdir(), "starter-release-fixture-"),
  );
  const sourceDirectory = path.join(temporaryDirectory, "source");
  const archiveName = options.assetName ?? "starter-web-v0.1.0.tar.gz";
  const nestedRootDirectory = options.nestedRootDirectory;
  const fixtureRoot = nestedRootDirectory
    ? path.join(sourceDirectory, nestedRootDirectory)
    : sourceDirectory;
  const manifest = {
    ...DEFAULT_MANIFEST,
    ...options.manifestOverride,
  };
  const files = {
    ...DEFAULT_FILES,
    "starter.manifest.json": JSON.stringify(manifest, null, 2),
  };
  const omittedPaths = new Set(options.omitFiles);

  mkdirSync(fixtureRoot, { recursive: true });

  for (const [relativePath, contents] of Object.entries(files)) {
    if (omittedPaths.has(relativePath)) {
      continue;
    }

    writeFixtureFile(fixtureRoot, relativePath, contents);
  }

  const archivePath = path.join(temporaryDirectory, archiveName);
  const tarInputs = nestedRootDirectory ? [nestedRootDirectory] : ["."];

  execFileSync(TAR_EXECUTABLE, ["-czf", archivePath, "-C", sourceDirectory, ...tarInputs]);

  return {
    archivePath,
    cleanup: () => rmSync(temporaryDirectory, { recursive: true, force: true }),
  };
}
