import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { UserOrderByWithRelationInputObjectSchema as UserOrderByWithRelationInputObjectSchema } from './UserOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  content: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  user: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const NoteOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.NoteOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.NoteOrderByWithRelationInput>;
export const NoteOrderByWithRelationInputObjectZodSchema = makeSchema();
