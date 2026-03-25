import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(import.meta.dirname, "../..");
const packageJsonPath = path.join(repoRoot, "package.json");
const nuxtConfigPath = path.join(repoRoot, "nuxt.config.ts");
const envExamplePath = path.join(repoRoot, ".env.example");
const appConfigPath = path.join(repoRoot, "app/app.config.ts");

const requiredNuxtModules = [
  "@nuxt/eslint",
  "@nuxt/ui",
  "@pinia/colada-nuxt",
  "@vueuse/nuxt",
] as const;

const requiredPackages = [
  ...requiredNuxtModules,
  "better-auth",
  "@orpc/server",
  "@orpc/client",
  "@prisma/client",
  "@prisma/adapter-pg",
  "prisma",
  "prisma-zod-generator",
  "zod",
  "vitest",
] as const;

const runtimeConfigKeys = [
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
  "AUTH_EMAIL_MODE",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
] as const;

type PackageJson = {
  name: string;
  packageManager?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

function readPackageJson(): PackageJson {
  return JSON.parse(readFileSync(packageJsonPath, "utf8")) as PackageJson;
}

function readNuxtConfigSource(): string {
  return readFileSync(nuxtConfigPath, "utf8");
}

function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractObjectBlock(source: string, propertyName: string): string {
  const propertyIndex = source.indexOf(`${propertyName}:`);

  if (propertyIndex === -1) {
    throw new Error(`Missing ${propertyName} block`);
  }

  const objectStartIndex = source.indexOf("{", propertyIndex);

  if (objectStartIndex === -1) {
    throw new Error(`Missing opening brace for ${propertyName}`);
  }

  let depth = 0;

  for (let index = objectStartIndex; index < source.length; index += 1) {
    const character = source[index];

    if (character === "{") {
      depth += 1;
    }

    if (character === "}") {
      depth -= 1;

      if (depth === 0) {
        return source.slice(objectStartIndex + 1, index);
      }
    }
  }

  throw new Error(`Missing closing brace for ${propertyName}`);
}

describe("starter root configuration contract", () => {
  it("keeps the starter package shallow and Bun-oriented", () => {
    const packageJson = readPackageJson();
    const installedPackages = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    expect(packageJson.name).toBe("__PACKAGE_NAME__");
    expect(packageJson.packageManager).toMatch(/^bun@/);
    expect(packageJson.scripts).toMatchObject({
      dev: "nuxt dev",
      lint: "eslint .",
      typecheck: "nuxi typecheck",
      "prisma:generate": "prisma generate",
      "prisma:migrate:dev": "prisma migrate dev",
      "prisma:db:seed": "prisma db seed",
    });

    for (const packageName of requiredPackages) {
      expect(installedPackages).toHaveProperty(packageName);
    }
  });

  it("enables SSR, wires CSS, and exposes only the expected auth runtime config", () => {
    const nuxtConfigSource = readNuxtConfigSource();
    const runtimeConfigBlock = extractObjectBlock(nuxtConfigSource, "runtimeConfig");
    const runtimeConfigAssignments = Array.from(
      runtimeConfigBlock.matchAll(/^\s*([A-Z_]+)\s*:/gm),
      ([, key]) => key,
    );

    expect(nuxtConfigSource).toMatch(/\bssr:\s*true\b/);
    expect(nuxtConfigSource).toMatch(/\bpreset:\s*"bun"/);

    for (const moduleName of requiredNuxtModules) {
      expect(nuxtConfigSource).toMatch(
        new RegExp(`['"]${escapeForRegExp(moduleName)}['"]`),
      );
    }

    expect(nuxtConfigSource).toMatch(/assets\/css\/main\.css/);
    expect(runtimeConfigAssignments.sort()).toEqual([...runtimeConfigKeys].sort());

    for (const runtimeConfigKey of runtimeConfigKeys) {
      expect(runtimeConfigBlock).toMatch(
        new RegExp(
          `${runtimeConfigKey}:\\s*process\\.env\\.${runtimeConfigKey}\\b`,
        ),
      );
    }
  });

  it("keeps the starter env and app config placeholders intact", () => {
    const envExample = readFileSync(envExamplePath, "utf8");
    const appConfig = readFileSync(appConfigPath, "utf8");

    expect(envExample).toContain("DATABASE_URL=");

    for (const runtimeConfigKey of runtimeConfigKeys) {
      expect(envExample).toContain(`${runtimeConfigKey}=`);
    }

    expect(envExample).toMatch(/smtp/i);
    expect(envExample).toMatch(/placeholder/i);
    expect(appConfig).toContain("__APP_NAME__");
    expect(readFileSync(nuxtConfigPath, "utf8")).toContain("assets/css/main.css");
  });
});
