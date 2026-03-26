import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client/client";

export type { TransactionClient } from "./generated/client/internal/prismaNamespace";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Environment variable DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });
