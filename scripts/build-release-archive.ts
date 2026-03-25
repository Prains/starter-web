import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

type BuildReleaseArchiveOptions = {
  distDirectory?: string;
  repoRoot?: string;
};

type PackageJson = {
  version?: string;
};

const EXCLUDED_PATH_SEGMENTS = new Set([
  ".git",
  ".nuxt",
  ".output",
  "dist",
  "node_modules",
  ".context",
  ".data",
  "playwright-report",
]);
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

function normalizeArchivePath(relativePath: string): string {
  return relativePath.replaceAll("\\", "/").replace(/^\.\//, "");
}

function isExcludedArchivePath(relativePath: string): boolean {
  const normalizedPath = normalizeArchivePath(relativePath);

  if (normalizedPath.length === 0) {
    return true;
  }

  if (normalizedPath === ".env") {
    return true;
  }

  if (normalizedPath.startsWith(".env.") && normalizedPath !== ".env.example") {
    return true;
  }

  return normalizedPath
    .split("/")
    .some((pathSegment) => EXCLUDED_PATH_SEGMENTS.has(pathSegment));
}

function listArchiveEntriesFromGit(repoRoot: string): string[] {
  if (!existsSync(path.join(repoRoot, ".git"))) {
    return [];
  }

  const gitOutput = execFileSync(
    "git",
    ["ls-files", "--cached", "-z"],
    { cwd: repoRoot, encoding: "buffer" },
  );

  return gitOutput
    .toString("utf8")
    .split("\0")
    .filter((entry) => entry.length > 0)
    .map((entry) => normalizeArchivePath(entry))
    .filter((entry) => !isExcludedArchivePath(entry));
}

function listArchiveEntriesFromFilesystem(
  repoRoot: string,
  currentDirectory = repoRoot,
): string[] {
  const archiveEntries: string[] = [];

  for (const entry of readdirSync(currentDirectory, { withFileTypes: true })) {
    const absolutePath = path.join(currentDirectory, entry.name);
    const relativePath = normalizeArchivePath(path.relative(repoRoot, absolutePath));

    if (isExcludedArchivePath(relativePath)) {
      continue;
    }

    if (entry.isDirectory()) {
      archiveEntries.push(...listArchiveEntriesFromFilesystem(repoRoot, absolutePath));

      continue;
    }

    archiveEntries.push(relativePath);
  }

  return archiveEntries;
}

function listArchiveEntries(repoRoot: string): string[] {
  const gitTrackedEntries = listArchiveEntriesFromGit(repoRoot);

  if (gitTrackedEntries.length > 0) {
    return gitTrackedEntries;
  }

  return listArchiveEntriesFromFilesystem(repoRoot);
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
  const archiveEntries = listArchiveEntries(repoRoot);

  mkdirSync(distributionDirectory, { recursive: true });
  rmSync(archivePath, { force: true });

  if (archiveEntries.length === 0) {
    throw new Error("starter release archive build found no files to package");
  }

  execFileSync(TAR_EXECUTABLE, [
    "-czf",
    archivePath,
    "-C",
    repoRoot,
    ...archiveEntries,
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
