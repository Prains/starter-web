import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { NoteWhereUniqueInputObjectSchema as NoteWhereUniqueInputObjectSchema } from './NoteWhereUniqueInput.schema';
import { NoteUpdateWithoutUserInputObjectSchema as NoteUpdateWithoutUserInputObjectSchema } from './NoteUpdateWithoutUserInput.schema';
import { NoteUncheckedUpdateWithoutUserInputObjectSchema as NoteUncheckedUpdateWithoutUserInputObjectSchema } from './NoteUncheckedUpdateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => NoteWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => NoteUpdateWithoutUserInputObjectSchema), z.lazy(() => NoteUncheckedUpdateWithoutUserInputObjectSchema)])
}).strict();
export const NoteUpdateWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.NoteUpdateWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.NoteUpdateWithWhereUniqueWithoutUserInput>;
export const NoteUpdateWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
