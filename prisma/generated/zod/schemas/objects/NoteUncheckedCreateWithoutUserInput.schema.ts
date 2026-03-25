import * as z from 'zod';
import type { Prisma } from '../../../client/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  title: z.string(),
  content: z.string().optional().nullable(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional()
}).strict();
export const NoteUncheckedCreateWithoutUserInputObjectSchema: z.ZodType<Prisma.NoteUncheckedCreateWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.NoteUncheckedCreateWithoutUserInput>;
export const NoteUncheckedCreateWithoutUserInputObjectZodSchema = makeSchema();
