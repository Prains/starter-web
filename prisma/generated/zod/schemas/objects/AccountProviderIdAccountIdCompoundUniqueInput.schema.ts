import * as z from 'zod';
import type { Prisma } from '../../../client/client';


const makeSchema = () => z.object({
  providerId: z.string(),
  accountId: z.string()
}).strict();
export const AccountProviderIdAccountIdCompoundUniqueInputObjectSchema: z.ZodType<Prisma.AccountProviderIdAccountIdCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.AccountProviderIdAccountIdCompoundUniqueInput>;
export const AccountProviderIdAccountIdCompoundUniqueInputObjectZodSchema = makeSchema();
