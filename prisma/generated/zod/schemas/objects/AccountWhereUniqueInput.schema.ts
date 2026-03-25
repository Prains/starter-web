import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { AccountProviderIdAccountIdCompoundUniqueInputObjectSchema as AccountProviderIdAccountIdCompoundUniqueInputObjectSchema } from './AccountProviderIdAccountIdCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  providerId_accountId: z.lazy(() => AccountProviderIdAccountIdCompoundUniqueInputObjectSchema).optional()
}).strict();
export const AccountWhereUniqueInputObjectSchema: z.ZodType<Prisma.AccountWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.AccountWhereUniqueInput>;
export const AccountWhereUniqueInputObjectZodSchema = makeSchema();
