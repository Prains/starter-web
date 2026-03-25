import { hashPassword } from "better-auth/crypto";

import { prisma, prismaPool } from "./client.ts";

const demoPasswordProviderId = "credential";

export const DEMO_USER_EMAIL = "demo@example.com";
export const DEMO_USER_ID = "demo-user";
export const DEMO_USER_NAME = "Demo User";
export const DEMO_USER_PASSWORD = "DemoPassword123!";
export const DEMO_NOTES = [
  {
    id: "demo-note-welcome",
    title: "Welcome to the starter",
    content:
      "This seeded demo account proves auth, Prisma, and the notes module are wired together.",
    created_at: new Date("2026-03-25T09:00:00.000Z"),
    updated_at: new Date("2026-03-25T09:00:00.000Z"),
  },
  {
    id: "demo-note-checklist",
    title: "Next setup steps",
    content:
      "Replace the demo credentials, configure SMTP for production, and start building your own features.",
    created_at: new Date("2026-03-25T09:05:00.000Z"),
    updated_at: new Date("2026-03-25T09:05:00.000Z"),
  },
] as const;

type SeedPrismaClient = typeof prisma;

export async function runSeed(prismaClient: SeedPrismaClient): Promise<void> {
  const passwordHash = await hashPassword(DEMO_USER_PASSWORD);
  const demoUser = await prismaClient.user.upsert({
    where: {
      email: DEMO_USER_EMAIL,
    },
    update: {
      name: DEMO_USER_NAME,
      emailVerified: true,
      image: null,
    },
    create: {
      id: DEMO_USER_ID,
      email: DEMO_USER_EMAIL,
      name: DEMO_USER_NAME,
      emailVerified: true,
      image: null,
    },
  });

  await prismaClient.account.upsert({
    where: {
      providerId_accountId: {
        providerId: demoPasswordProviderId,
        accountId: demoUser.id,
      },
    },
    update: {
      userId: demoUser.id,
      password: passwordHash,
    },
    create: {
      userId: demoUser.id,
      providerId: demoPasswordProviderId,
      accountId: demoUser.id,
      password: passwordHash,
    },
  });

  await prismaClient.note.deleteMany({
    where: {
      user_id: demoUser.id,
    },
  });

  await prismaClient.note.createMany({
    data: DEMO_NOTES.map((note) => ({
      ...note,
      user_id: demoUser.id,
    })),
  });
}

async function main(): Promise<void> {
  await runSeed(prisma);
}

if (import.meta.main) {
  main()
    .catch((error: unknown) => {
      console.error("Failed to seed database.", error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await prisma.$disconnect();
      await prismaPool.end();
    });
}
