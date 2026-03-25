import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

const repoRoot = path.resolve(import.meta.dirname, "../..");
const packageJsonPath = path.join(repoRoot, "package.json");
const envExamplePath = path.join(repoRoot, ".env.example");
const appConfigPath = path.join(repoRoot, "app/app.config.ts");
const cssEntrypointPath = path.join(repoRoot, "app/assets/css/main.css");

const requiredNuxtModules = [
  "@nuxt/eslint",
  "@nuxt/ui",
  "@pinia/nuxt",
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

type RuntimeConfigKey = (typeof runtimeConfigKeys)[number];

type PackageJson = {
  name: string;
  packageManager?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

type RootRuntimeConfig = Partial<Record<RuntimeConfigKey, string | undefined>>;

type RootNuxtConfig = {
  css?: string[];
  modules?: string[];
  nitro?: {
    preset?: string;
  };
  runtimeConfig?: RootRuntimeConfig;
  ssr?: boolean;
};

function readPackageJson(): PackageJson {
  return JSON.parse(readFileSync(packageJsonPath, "utf8")) as PackageJson;
}

function getRuntimeOverrideEnvName(runtimeConfigKey: RuntimeConfigKey): string {
  return `NUXT_${runtimeConfigKey}`;
}

function getFallbackEnvValues(prefix: string): Record<RuntimeConfigKey, string> {
  return {
    BETTER_AUTH_SECRET: `${prefix}-secret`,
    BETTER_AUTH_URL: `https://${prefix}.example.com`,
    AUTH_EMAIL_MODE: `${prefix}-mode`,
    SMTP_HOST: `${prefix}.smtp.example.com`,
    SMTP_PORT: prefix === "runtime" ? "2525" : "1025",
    SMTP_USER: `${prefix}-user`,
    SMTP_PASS: `${prefix}-pass`,
    SMTP_FROM: `${prefix}@example.com`,
  };
}

function getReferencedLocalScriptPaths(
  scripts: Record<string, string> = {},
): string[] {
  const referencedPaths = new Set<string>();
  const localPathPattern = /(?:^|\s)(?:bun|node|bash|sh)\s+((?:\.\/)?(?:scripts|test)\/[^\s;&|]+)/g;

  for (const scriptCommand of Object.values(scripts)) {
    for (const match of scriptCommand.matchAll(localPathPattern)) {
      referencedPaths.add(match[1].replace(/^\.\//, ""));
    }
  }

  return [...referencedPaths];
}

async function loadRootNuxtConfig(): Promise<RootNuxtConfig> {
  vi.resetModules();
  vi.stubGlobal(
    "defineNuxtConfig",
    (config: RootNuxtConfig): RootNuxtConfig => config,
  );

  const imported = await import("../../nuxt.config.ts");

  return imported.default as RootNuxtConfig;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("starter root configuration contract", () => {
  it("keeps the starter package shallow and script targets self-contained", () => {
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
      "release:build-archive": "bun scripts/build-release-archive.ts",
      "release:verify-archive": "bun scripts/verify-release-archive.ts",
    });

    for (const packageName of requiredPackages) {
      expect(installedPackages).toHaveProperty(packageName);
    }

    for (const relativePath of getReferencedLocalScriptPaths(packageJson.scripts)) {
      expect(existsSync(path.join(repoRoot, relativePath))).toBe(true);
    }
  });

  it("uses matching NUXT_* envs for runtime overrides", async () => {
    const runtimeValues = getFallbackEnvValues("runtime");
    const fallbackValues = getFallbackEnvValues("fallback");

    for (const runtimeConfigKey of runtimeConfigKeys) {
      vi.stubEnv(runtimeConfigKey, fallbackValues[runtimeConfigKey]);
      vi.stubEnv(
        getRuntimeOverrideEnvName(runtimeConfigKey),
        runtimeValues[runtimeConfigKey],
      );
    }

    const rootConfig = await loadRootNuxtConfig();

    expect(rootConfig.ssr).toBe(true);
    expect(rootConfig.nitro?.preset).toBe("bun");
    expect(rootConfig.css).toContain("~/assets/css/main.css");
    expect(rootConfig.modules).toEqual(
      expect.arrayContaining([...requiredNuxtModules]),
    );
    expect(Object.keys(rootConfig.runtimeConfig ?? {}).sort()).toEqual(
      [...runtimeConfigKeys].sort(),
    );

    for (const runtimeConfigKey of runtimeConfigKeys) {
      expect(rootConfig.runtimeConfig?.[runtimeConfigKey]).toBe(
        runtimeValues[runtimeConfigKey],
      );
    }
  });

  it("falls back to unprefixed envs for local development defaults", async () => {
    const fallbackValues = getFallbackEnvValues("local");

    for (const runtimeConfigKey of runtimeConfigKeys) {
      vi.stubEnv(runtimeConfigKey, fallbackValues[runtimeConfigKey]);
    }

    const rootConfig = await loadRootNuxtConfig();

    for (const runtimeConfigKey of runtimeConfigKeys) {
      expect(rootConfig.runtimeConfig?.[runtimeConfigKey]).toBe(
        fallbackValues[runtimeConfigKey],
      );
    }
  });

  it("documents canonical auth envs and keeps app placeholders intact", () => {
    const envExample = readFileSync(envExamplePath, "utf8");
    const appConfig = readFileSync(appConfigPath, "utf8");

    expect(existsSync(cssEntrypointPath)).toBe(true);
    expect(envExample).toContain("DATABASE_URL=");

    for (const runtimeConfigKey of runtimeConfigKeys) {
      expect(envExample).toMatch(
        new RegExp(`(^|\\n)${runtimeConfigKey}=`, "m"),
      );
    }

    expect(envExample).toMatch(/smtp/i);
    expect(envExample).toMatch(/placeholder/i);
    expect(envExample).toMatch(/NUXT_/i);
    expect(envExample).toMatch(/override|mirror/i);
    expect(appConfig).toContain("__APP_NAME__");
  });
});
