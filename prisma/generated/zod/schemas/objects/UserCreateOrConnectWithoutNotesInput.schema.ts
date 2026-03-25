import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutNotesInputObjectSchema as UserCreateWithoutNotesInputObjectSchema } from './UserCreateWithoutNotesInput.schema';
import { UserUncheckedCreateWithoutNotesInputObjectSchema as UserUncheckedCreateWithoutNotesInputObjectSchema } from './UserUncheckedCreateWithoutNotesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutNotesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutNotesInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutNotesInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutNotesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutNotesInput>;
export const UserCreateOrConnectWithoutNotesInputObjectZodSchema = makeSchema();
