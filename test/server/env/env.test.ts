import { afterEach, describe, expect, it, vi } from "vitest";

type ParseAuthEnv = (
  rawEnv: Record<string, string | undefined>,
  options?: {
    nodeEnv?: string;
  },
) => {
  authEmailMode: "log" | "smtp";
  smtp:
    | {
        host: string;
        port: number;
        user: string;
        pass: string;
        from: string;
      }
    | null;
};

async function loadParseAuthEnv(): Promise<ParseAuthEnv> {
  const module = await import("../../../server/utils/env.ts");

  return (module as { parseAuthEnv: ParseAuthEnv }).parseAuthEnv;
}

type NitroRuntimeConfig = {
  AUTH_EMAIL_MODE?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SMTP_FROM?: string;
};

type NitroPlugin = (nitroApp: unknown) => void;

async function loadValidateAuthEnvPlugin(
  runtimeConfig: NitroRuntimeConfig,
): Promise<NitroPlugin> {
  vi.resetModules();
  vi.stubGlobal("defineNitroPlugin", (plugin: NitroPlugin): NitroPlugin => plugin);
  vi.stubGlobal("useRuntimeConfig", (): NitroRuntimeConfig => runtimeConfig);

  const module = await import("../../../server/plugins/validate-auth-env.ts");

  return module.default as NitroPlugin;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("parseAuthEnv", () => {
  it("allows log email mode without SMTP variables", async () => {
    const parseAuthEnv = await loadParseAuthEnv();

    expect(
      parseAuthEnv(
        {
          AUTH_EMAIL_MODE: "log",
        },
        {
          nodeEnv: "development",
        },
      ),
    ).toEqual({
      authEmailMode: "log",
      smtp: null,
    });
  });

  it("requires SMTP variables in smtp mode", async () => {
    const parseAuthEnv = await loadParseAuthEnv();

    expect(() =>
      parseAuthEnv(
        {
          AUTH_EMAIL_MODE: "smtp",
        },
        {
          nodeEnv: "development",
        },
      ),
    ).toThrow(/SMTP_HOST|SMTP_PORT|SMTP_USER|SMTP_PASS|SMTP_FROM/);
  });

  it("hard-fails production startup when AUTH_EMAIL_MODE=log", async () => {
    const parseAuthEnv = await loadParseAuthEnv();

    expect(() =>
      parseAuthEnv(
        {
          AUTH_EMAIL_MODE: "log",
        },
        {
          nodeEnv: "production",
        },
      ),
    ).toThrow(/AUTH_EMAIL_MODE=log.*production/i);
  });

  it("wires auth env validation into Nitro startup", async () => {
    vi.stubEnv("NODE_ENV", "production");

    const validateAuthEnvPlugin = await loadValidateAuthEnvPlugin({
      AUTH_EMAIL_MODE: "log",
    });

    expect(() => validateAuthEnvPlugin({})).toThrow(
      /AUTH_EMAIL_MODE=log.*production/i,
    );
  });
});
