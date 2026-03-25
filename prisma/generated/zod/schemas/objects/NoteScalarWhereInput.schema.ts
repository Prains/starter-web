import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const notescalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => NoteScalarWhereInputObjectSchema), z.lazy(() => NoteScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => NoteScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => NoteScalarWhereInputObjectSchema), z.lazy(() => NoteScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  user_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  content: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const NoteScalarWhereInputObjectSchema: z.ZodType<Prisma.NoteScalarWhereInput> = notescalarwhereinputSchema as unknown as z.ZodType<Prisma.NoteScalarWhereInput>;
export const NoteScalarWhereInputObjectZodSchema = notescalarwhereinputSchema;
