import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { PrismaClient } from "./generated/client/client";

type PrismaGlobals = typeof globalThis & {
  __starterWebPrisma?: PrismaClient;
  __starterWebPrismaPool?: Pool;
};

const globalForPrisma = globalThis as PrismaGlobals;

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to initialize Prisma.");
  }

  return databaseUrl;
}

function createPrismaResources(): {
  client: PrismaClient;
  pool: Pool;
} {
  const pool = new Pool({
    connectionString: getDatabaseUrl(),
  });
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({
    adapter,
  });

  return {
    client,
    pool,
  };
}

const prismaResources =
  globalForPrisma.__starterWebPrisma &&
  globalForPrisma.__starterWebPrismaPool
    ? {
        client: globalForPrisma.__starterWebPrisma,
        pool: globalForPrisma.__starterWebPrismaPool,
      }
    : createPrismaResources();

if (!globalForPrisma.__starterWebPrisma) {
  globalForPrisma.__starterWebPrisma = prismaResources.client;
}

if (!globalForPrisma.__starterWebPrismaPool) {
  globalForPrisma.__starterWebPrismaPool = prismaResources.pool;
}

export const prisma = prismaResources.client;
export const prismaPool = prismaResources.pool;
