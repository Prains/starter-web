import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { verifyPassword } from "better-auth/crypto";

const defaultDatabaseUrl =
  "postgresql://postgres:postgres@127.0.0.1:54329/starter_web_task2?schema=public";

type DemoNote = {
  id: string;
  title: string;
  content: string | null;
};

type DemoUser = {
  id: string;
  emailVerified: boolean;
  accounts: Array<{
    accountId: string;
    password: string | null;
  }>;
  notes: Array<DemoNote>;
};

type PrismaContract = {
  user: {
    deleteMany(args: {
      where: {
        email: string;
      };
    }): Promise<unknown>;
    findUnique(args: {
      where: {
        email: string;
      };
      include: {
        accounts: {
          where: {
            providerId: "credential";
          };
        };
      };
    }): Promise<DemoUser | null>;
    findUniqueOrThrow(args: {
      where: {
        email: string;
      };
      include: {
        notes: {
          where: {
            id: {
              in: string[];
            };
          };
          orderBy: {
            id: "asc";
          };
        };
      };
    }): Promise<DemoUser>;
  };
  note: {
    update(args: {
      where: {
        id: string;
      };
      data: {
        title: string;
        content: string;
      };
    }): Promise<unknown>;
  };
  $disconnect(): Promise<void>;
};

type PrismaPoolContract = {
  end(): Promise<void>;
};

type SeedContract = {
  DEMO_NOTES: DemoNote[];
  DEMO_USER_EMAIL: string;
  DEMO_USER_PASSWORD: string;
  runSeed(prisma: PrismaContract): Promise<void>;
};

async function loadSeedModules(): Promise<{
  prisma: PrismaContract;
  prismaPool: PrismaPoolContract | null;
  seed: SeedContract;
}> {
  process.env.DATABASE_URL ??= defaultDatabaseUrl;

  const [prismaModule, seedModule] = await Promise.all([
    import("../../../prisma/client.ts"),
    import("../../../prisma/seed.ts"),
  ]);

  return {
    prisma: (prismaModule as { prisma: PrismaContract }).prisma,
    prismaPool:
      (prismaModule as { prismaPool?: PrismaPoolContract }).prismaPool ?? null,
    seed: seedModule as SeedContract,
  };
}

async function resetDemoUser(): Promise<void> {
  const { prisma, seed } = await loadSeedModules();

  await prisma.user.deleteMany({
    where: {
      email: seed.DEMO_USER_EMAIL,
    },
  });
}

describe("runSeed", () => {
  beforeEach(async () => {
    await resetDemoUser();
  });

  afterAll(async () => {
    try {
      const { prisma, prismaPool } = await loadSeedModules();

      await prisma.$disconnect();
      await prismaPool?.end();
    } catch {
      // The RED phase can run before Prisma exists.
    }
  });

  it("creates the demo account with a verified credential password", async () => {
    const { prisma, seed } = await loadSeedModules();

    await seed.runSeed(prisma);

    const demoUser = await prisma.user.findUnique({
      where: {
        email: seed.DEMO_USER_EMAIL,
      },
      include: {
        accounts: {
          where: {
            providerId: "credential",
          },
        },
      },
    });

    expect(demoUser).not.toBeNull();
    expect(demoUser?.emailVerified).toBe(true);
    expect(demoUser?.accounts).toHaveLength(1);
    expect(demoUser?.accounts[0]?.accountId).toBe(demoUser?.id);
    expect(await verifyPassword({
      hash: demoUser?.accounts[0]?.password ?? "",
      password: seed.DEMO_USER_PASSWORD,
    })).toBe(true);
  });

  it("is idempotent and restores the deterministic demo note dataset", async () => {
    const { prisma, seed } = await loadSeedModules();

    await seed.runSeed(prisma);
    await prisma.note.update({
      where: {
        id: seed.DEMO_NOTES[0]!.id,
      },
      data: {
        title: "changed by test",
        content: "changed by test",
      },
    });

    await seed.runSeed(prisma);

    const demoUser = await prisma.user.findUniqueOrThrow({
      where: {
        email: seed.DEMO_USER_EMAIL,
      },
      include: {
        notes: {
          where: {
            id: {
              in: seed.DEMO_NOTES.map((note) => note.id),
            },
          },
          orderBy: {
            id: "asc",
          },
        },
      },
    });

    expect(demoUser.notes.map((note) => note.id)).toEqual(
      [...seed.DEMO_NOTES].map((note) => note.id).sort(),
    );
    expect(
      demoUser.notes.map((note) => ({
        id: note.id,
        title: note.title,
        content: note.content,
      })),
    ).toEqual(
      [...seed.DEMO_NOTES]
        .map((note) => ({
          id: note.id,
          title: note.title,
          content: note.content,
        }))
        .sort((left, right) => left.id.localeCompare(right.id)),
    );
  });
});
