import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { NoteWhereUniqueInputObjectSchema as NoteWhereUniqueInputObjectSchema } from './NoteWhereUniqueInput.schema';
import { NoteCreateWithoutUserInputObjectSchema as NoteCreateWithoutUserInputObjectSchema } from './NoteCreateWithoutUserInput.schema';
import { NoteUncheckedCreateWithoutUserInputObjectSchema as NoteUncheckedCreateWithoutUserInputObjectSchema } from './NoteUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => NoteWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => NoteCreateWithoutUserInputObjectSchema), z.lazy(() => NoteUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const NoteCreateOrConnectWithoutUserInputObjectSchema: z.ZodType<Prisma.NoteCreateOrConnectWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.NoteCreateOrConnectWithoutUserInput>;
export const NoteCreateOrConnectWithoutUserInputObjectZodSchema = makeSchema();
