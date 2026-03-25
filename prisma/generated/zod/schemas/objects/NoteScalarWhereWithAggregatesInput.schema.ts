import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const notescalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => NoteScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => NoteScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => NoteScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => NoteScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => NoteScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  user_id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  content: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const NoteScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.NoteScalarWhereWithAggregatesInput> = notescalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.NoteScalarWhereWithAggregatesInput>;
export const NoteScalarWhereWithAggregatesInputObjectZodSchema = notescalarwherewithaggregatesinputSchema;
