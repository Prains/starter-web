import * as z from 'zod';
import type { Prisma } from '../../../client/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  title: z.string(),
  content: z.string().optional().nullable(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional()
}).strict();
export const NoteCreateManyUserInputObjectSchema: z.ZodType<Prisma.NoteCreateManyUserInput> = makeSchema() as unknown as z.ZodType<Prisma.NoteCreateManyUserInput>;
export const NoteCreateManyUserInputObjectZodSchema = makeSchema();
