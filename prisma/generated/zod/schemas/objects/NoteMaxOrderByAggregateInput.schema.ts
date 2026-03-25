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
export const NoteMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.NoteMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.NoteMaxOrderByAggregateInput>;
export const NoteMaxOrderByAggregateInputObjectZodSchema = makeSchema();
