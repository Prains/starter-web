import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { NoteScalarWhereInputObjectSchema as NoteScalarWhereInputObjectSchema } from './NoteScalarWhereInput.schema';
import { NoteUpdateManyMutationInputObjectSchema as NoteUpdateManyMutationInputObjectSchema } from './NoteUpdateManyMutationInput.schema';
import { NoteUncheckedUpdateManyWithoutUserInputObjectSchema as NoteUncheckedUpdateManyWithoutUserInputObjectSchema } from './NoteUncheckedUpdateManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => NoteScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => NoteUpdateManyMutationInputObjectSchema), z.lazy(() => NoteUncheckedUpdateManyWithoutUserInputObjectSchema)])
}).strict();
export const NoteUpdateManyWithWhereWithoutUserInputObjectSchema: z.ZodType<Prisma.NoteUpdateManyWithWhereWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.NoteUpdateManyWithWhereWithoutUserInput>;
export const NoteUpdateManyWithWhereWithoutUserInputObjectZodSchema = makeSchema();
