import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

type BuildReleaseArchiveOptions = {
  distDirectory?: string;
  repoRoot?: string;
};

type PackageJson = {
  version?: string;
};

const EXCLUDED_PATHS = [
  ".git",
  ".nuxt",
  ".output",
  "dist",
  "node_modules",
  ".context",
  ".data",
  "playwright-report",
  ".env",
];
const TAR_EXECUTABLE = "/usr/bin/tar";

export function readStarterPackageVersion(repoRoot = process.cwd()): string {
  const packageJsonPath = path.join(repoRoot, "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as PackageJson;

  if (typeof packageJson.version !== "string" || packageJson.version.length === 0) {
    throw new Error("starter package.json must define a version before building a release archive");
  }

  return packageJson.version;
}

export function getReleaseArchiveFileName(version: string): string {
  return `starter-web-v${version}.tar.gz`;
}

export function buildReleaseArchive(
  options: BuildReleaseArchiveOptions = {},
): string {
  const repoRoot = path.resolve(options.repoRoot ?? process.cwd());
  const distributionDirectory = path.resolve(
    options.distDirectory ?? path.join(repoRoot, "dist"),
  );
  const version = readStarterPackageVersion(repoRoot);
  const archivePath = path.join(
    distributionDirectory,
    getReleaseArchiveFileName(version),
  );
  const excludeArguments = EXCLUDED_PATHS.flatMap((excludedPath) => [
    `--exclude=${excludedPath}`,
  ]);

  mkdirSync(distributionDirectory, { recursive: true });
  rmSync(archivePath, { force: true });

  execFileSync(TAR_EXECUTABLE, [
    "-czf",
    archivePath,
    ...excludeArguments,
    "-C",
    repoRoot,
    ".",
  ]);

  return archivePath;
}

function isDirectExecution(): boolean {
  if (!process.argv[1]) {
    return false;
  }

  return pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
}

if (isDirectExecution()) {
  const archivePath = buildReleaseArchive();

  console.log(`Built release archive: ${archivePath}`);
}
