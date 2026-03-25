import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { UserCreateWithoutNotesInputObjectSchema as UserCreateWithoutNotesInputObjectSchema } from './UserCreateWithoutNotesInput.schema';
import { UserUncheckedCreateWithoutNotesInputObjectSchema as UserUncheckedCreateWithoutNotesInputObjectSchema } from './UserUncheckedCreateWithoutNotesInput.schema';
import { UserCreateOrConnectWithoutNotesInputObjectSchema as UserCreateOrConnectWithoutNotesInputObjectSchema } from './UserCreateOrConnectWithoutNotesInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutNotesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutNotesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutNotesInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutNotesInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutNotesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutNotesInput>;
export const UserCreateNestedOneWithoutNotesInputObjectZodSchema = makeSchema();
