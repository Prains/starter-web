import { os } from "@orpc/server";
import type { prisma } from "../../prisma/client";

export type PrismaClientType = typeof prisma;
export type ORPCSession = {
  id: string;
  userId: string;
  expiresAt: Date;
};
export type ORPCUser = {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image: string | null;
};
export type ORPCContext = {
  prisma: PrismaClientType;
  request: Request;
  session?: ORPCSession;
  user?: ORPCUser;
};

export const base = os.$context<ORPCContext>();
