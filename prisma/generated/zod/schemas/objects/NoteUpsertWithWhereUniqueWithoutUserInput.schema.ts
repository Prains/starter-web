import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { NoteWhereUniqueInputObjectSchema as NoteWhereUniqueInputObjectSchema } from './NoteWhereUniqueInput.schema';
import { NoteUpdateWithoutUserInputObjectSchema as NoteUpdateWithoutUserInputObjectSchema } from './NoteUpdateWithoutUserInput.schema';
import { NoteUncheckedUpdateWithoutUserInputObjectSchema as NoteUncheckedUpdateWithoutUserInputObjectSchema } from './NoteUncheckedUpdateWithoutUserInput.schema';
import { NoteCreateWithoutUserInputObjectSchema as NoteCreateWithoutUserInputObjectSchema } from './NoteCreateWithoutUserInput.schema';
import { NoteUncheckedCreateWithoutUserInputObjectSchema as NoteUncheckedCreateWithoutUserInputObjectSchema } from './NoteUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => NoteWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => NoteUpdateWithoutUserInputObjectSchema), z.lazy(() => NoteUncheckedUpdateWithoutUserInputObjectSchema)]),
  create: z.union([z.lazy(() => NoteCreateWithoutUserInputObjectSchema), z.lazy(() => NoteUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const NoteUpsertWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.NoteUpsertWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.NoteUpsertWithWhereUniqueWithoutUserInput>;
export const NoteUpsertWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
