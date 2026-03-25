import { describe, expect, it } from "vitest";

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
});
