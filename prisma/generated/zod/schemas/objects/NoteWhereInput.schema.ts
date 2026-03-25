import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { UserScalarRelationFilterObjectSchema as UserScalarRelationFilterObjectSchema } from './UserScalarRelationFilter.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const notewhereinputSchema = z.object({
  AND: z.union([z.lazy(() => NoteWhereInputObjectSchema), z.lazy(() => NoteWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => NoteWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => NoteWhereInputObjectSchema), z.lazy(() => NoteWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  user_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  content: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  user: z.union([z.lazy(() => UserScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional()
}).strict();
export const NoteWhereInputObjectSchema: z.ZodType<Prisma.NoteWhereInput> = notewhereinputSchema as unknown as z.ZodType<Prisma.NoteWhereInput>;
export const NoteWhereInputObjectZodSchema = notewhereinputSchema;
