import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { z } from "zod";
import {
  getReleaseArchiveFileName,
  readStarterPackageVersion,
} from "./build-release-archive";

type VerifyReleaseArchiveOptions = {
  archivePath?: string;
  repoRoot?: string;
};

type PackageJson = {
  version?: string;
};

const templateManifestSchema = z.object({
  schemaVersion: z.literal(1),
  templateVersion: z.string().min(1),
  packageNameToken: z.literal("__PACKAGE_NAME__"),
  appNameToken: z.literal("__APP_NAME__"),
  packageNameFiles: z.array(z.string().min(1)).min(1),
  appNameFiles: z.array(z.string().min(1)).min(1),
  copyEnvExampleToEnv: z.boolean(),
  defaultGitInit: z.boolean(),
});
const TAR_EXECUTABLE = "/usr/bin/tar";

function readJsonFile<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, "utf8")) as T;
}

function assertFileExists(filePath: string, description: string): void {
  if (!existsSync(filePath)) {
    throw new Error(`${description} is missing at ${filePath}`);
  }
}

function assertArchiveRootShape(extractedRoot: string): void {
  const manifestAtRoot = path.join(extractedRoot, "starter.manifest.json");

  if (existsSync(manifestAtRoot)) {
    return;
  }

  const nestedManifestEntry = readdirSync(extractedRoot, { withFileTypes: true }).find(
    (entry) =>
      entry.isDirectory() &&
      existsSync(path.join(extractedRoot, entry.name, "starter.manifest.json")),
  );

  if (nestedManifestEntry) {
    throw new Error(
      `Release archive expands into a nested top-level directory: ${nestedManifestEntry.name}`,
    );
  }

  throw new Error("starter.manifest.json must exist at the archive root");
}

export async function verifyReleaseArchive(
  options: VerifyReleaseArchiveOptions = {},
): Promise<string> {
  const repoRoot = path.resolve(options.repoRoot ?? process.cwd());
  const configuredVersion = readStarterPackageVersion(repoRoot);
  const archivePath = path.resolve(
    options.archivePath ?? path.join(repoRoot, "dist", getReleaseArchiveFileName(configuredVersion)),
  );
  const extractionRoot = mkdtempSync(path.join(os.tmpdir(), "starter-release-verify-"));

  try {
    execFileSync(TAR_EXECUTABLE, ["-xzf", archivePath, "-C", extractionRoot]);
    assertArchiveRootShape(extractionRoot);

    const manifestPath = path.join(extractionRoot, "starter.manifest.json");
    const packageJsonPath = path.join(extractionRoot, "package.json");
    const nuxtConfigPath = path.join(extractionRoot, "nuxt.config.ts");

    assertFileExists(packageJsonPath, "package.json");
    assertFileExists(nuxtConfigPath, "nuxt.config.ts");

    const packageJson = readJsonFile<PackageJson>(packageJsonPath);

    if (typeof packageJson.version !== "string" || packageJson.version.length === 0) {
      throw new Error("archive package.json must define a version");
    }

    const expectedAssetName = getReleaseArchiveFileName(packageJson.version);
    const actualAssetName = path.basename(archivePath);

    if (actualAssetName !== expectedAssetName) {
      throw new Error(
        `Release archive asset must be named ${expectedAssetName}, got ${actualAssetName}`,
      );
    }

    const manifestResult = templateManifestSchema.safeParse(
      readJsonFile<unknown>(manifestPath),
    );

    if (!manifestResult.success) {
      throw new Error(`Invalid starter.manifest.json: ${manifestResult.error.message}`);
    }

    const manifest = manifestResult.data;
    const requiredManifestFiles = [
      ...manifest.packageNameFiles,
      ...manifest.appNameFiles,
    ];

    if (manifest.copyEnvExampleToEnv) {
      assertFileExists(path.join(extractionRoot, ".env.example"), ".env.example");
    }

    for (const relativePath of requiredManifestFiles) {
      assertFileExists(
        path.join(extractionRoot, relativePath),
        `manifest-listed file ${relativePath}`,
      );
    }

    if (manifest.templateVersion !== packageJson.version) {
      throw new Error(
        `starter.manifest.json templateVersion ${manifest.templateVersion} does not match package.json version ${packageJson.version}`,
      );
    }

    return archivePath;
  } finally {
    rmSync(extractionRoot, { recursive: true, force: true });
  }
}

function isDirectExecution(): boolean {
  if (!process.argv[1]) {
    return false;
  }

  return pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
}

if (isDirectExecution()) {
  const archivePath = await verifyReleaseArchive();

  console.log(`Verified release archive: ${archivePath}`);
}
