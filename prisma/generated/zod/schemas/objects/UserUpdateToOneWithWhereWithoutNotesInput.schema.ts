import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutNotesInputObjectSchema as UserUpdateWithoutNotesInputObjectSchema } from './UserUpdateWithoutNotesInput.schema';
import { UserUncheckedUpdateWithoutNotesInputObjectSchema as UserUncheckedUpdateWithoutNotesInputObjectSchema } from './UserUncheckedUpdateWithoutNotesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutNotesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutNotesInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutNotesInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutNotesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutNotesInput>;
export const UserUpdateToOneWithWhereWithoutNotesInputObjectZodSchema = makeSchema();
