import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { UserUpdateWithoutNotesInputObjectSchema as UserUpdateWithoutNotesInputObjectSchema } from './UserUpdateWithoutNotesInput.schema';
import { UserUncheckedUpdateWithoutNotesInputObjectSchema as UserUncheckedUpdateWithoutNotesInputObjectSchema } from './UserUncheckedUpdateWithoutNotesInput.schema';
import { UserCreateWithoutNotesInputObjectSchema as UserCreateWithoutNotesInputObjectSchema } from './UserCreateWithoutNotesInput.schema';
import { UserUncheckedCreateWithoutNotesInputObjectSchema as UserUncheckedCreateWithoutNotesInputObjectSchema } from './UserUncheckedCreateWithoutNotesInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutNotesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutNotesInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutNotesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutNotesInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutNotesInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutNotesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutNotesInput>;
export const UserUpsertWithoutNotesInputObjectZodSchema = makeSchema();
