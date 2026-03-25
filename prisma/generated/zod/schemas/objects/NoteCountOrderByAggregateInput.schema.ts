import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  content: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const NoteCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.NoteCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.NoteCountOrderByAggregateInput>;
export const NoteCountOrderByAggregateInputObjectZodSchema = makeSchema();
