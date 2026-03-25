import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { NoteSelectObjectSchema as NoteSelectObjectSchema } from './NoteSelect.schema';
import { NoteIncludeObjectSchema as NoteIncludeObjectSchema } from './NoteInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => NoteSelectObjectSchema).optional(),
  include: z.lazy(() => NoteIncludeObjectSchema).optional()
}).strict();
export const NoteArgsObjectSchema = makeSchema();
export const NoteArgsObjectZodSchema = makeSchema();
