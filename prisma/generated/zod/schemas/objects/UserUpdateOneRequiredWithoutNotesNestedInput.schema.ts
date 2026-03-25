import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { UserCreateWithoutNotesInputObjectSchema as UserCreateWithoutNotesInputObjectSchema } from './UserCreateWithoutNotesInput.schema';
import { UserUncheckedCreateWithoutNotesInputObjectSchema as UserUncheckedCreateWithoutNotesInputObjectSchema } from './UserUncheckedCreateWithoutNotesInput.schema';
import { UserCreateOrConnectWithoutNotesInputObjectSchema as UserCreateOrConnectWithoutNotesInputObjectSchema } from './UserCreateOrConnectWithoutNotesInput.schema';
import { UserUpsertWithoutNotesInputObjectSchema as UserUpsertWithoutNotesInputObjectSchema } from './UserUpsertWithoutNotesInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutNotesInputObjectSchema as UserUpdateToOneWithWhereWithoutNotesInputObjectSchema } from './UserUpdateToOneWithWhereWithoutNotesInput.schema';
import { UserUpdateWithoutNotesInputObjectSchema as UserUpdateWithoutNotesInputObjectSchema } from './UserUpdateWithoutNotesInput.schema';
import { UserUncheckedUpdateWithoutNotesInputObjectSchema as UserUncheckedUpdateWithoutNotesInputObjectSchema } from './UserUncheckedUpdateWithoutNotesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutNotesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutNotesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutNotesInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutNotesInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutNotesInputObjectSchema), z.lazy(() => UserUpdateWithoutNotesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutNotesInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneRequiredWithoutNotesNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutNotesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneRequiredWithoutNotesNestedInput>;
export const UserUpdateOneRequiredWithoutNotesNestedInputObjectZodSchema = makeSchema();
