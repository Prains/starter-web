import * as z from 'zod';
import type { Prisma } from '../../../client/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  user_id: z.string(),
  title: z.string(),
  content: z.string().optional().nullable(),
  created_at: z.coerce.date().optional()
}).strict();
export const NoteUncheckedCreateInputObjectSchema: z.ZodType<Prisma.NoteUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.NoteUncheckedCreateInput>;
export const NoteUncheckedCreateInputObjectZodSchema = makeSchema();
