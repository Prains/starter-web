import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  user_id: z.boolean().optional(),
  title: z.boolean().optional(),
  content: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional()
}).strict();
export const NoteSelectObjectSchema: z.ZodType<Prisma.NoteSelect> = makeSchema() as unknown as z.ZodType<Prisma.NoteSelect>;
export const NoteSelectObjectZodSchema = makeSchema();
