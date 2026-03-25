import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { UserCreateNestedOneWithoutNotesInputObjectSchema as UserCreateNestedOneWithoutNotesInputObjectSchema } from './UserCreateNestedOneWithoutNotesInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  title: z.string(),
  content: z.string().optional().nullable(),
  created_at: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutNotesInputObjectSchema)
}).strict();
export const NoteCreateInputObjectSchema: z.ZodType<Prisma.NoteCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.NoteCreateInput>;
export const NoteCreateInputObjectZodSchema = makeSchema();
