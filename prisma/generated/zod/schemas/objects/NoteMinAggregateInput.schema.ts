import * as z from 'zod';
import type { Prisma } from '../../../client/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  title: z.literal(true).optional(),
  content: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
export const NoteMinAggregateInputObjectSchema: z.ZodType<Prisma.NoteMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.NoteMinAggregateInputType>;
export const NoteMinAggregateInputObjectZodSchema = makeSchema();
