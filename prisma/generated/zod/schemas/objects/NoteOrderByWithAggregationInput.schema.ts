import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { NoteCountOrderByAggregateInputObjectSchema as NoteCountOrderByAggregateInputObjectSchema } from './NoteCountOrderByAggregateInput.schema';
import { NoteMaxOrderByAggregateInputObjectSchema as NoteMaxOrderByAggregateInputObjectSchema } from './NoteMaxOrderByAggregateInput.schema';
import { NoteMinOrderByAggregateInputObjectSchema as NoteMinOrderByAggregateInputObjectSchema } from './NoteMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  content: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => NoteCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => NoteMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => NoteMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const NoteOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.NoteOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.NoteOrderByWithAggregationInput>;
export const NoteOrderByWithAggregationInputObjectZodSchema = makeSchema();
