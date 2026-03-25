import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema'

const makeSchema = () => z.object({
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional()
}).strict();
export const NoteIncludeObjectSchema: z.ZodType<Prisma.NoteInclude> = makeSchema() as unknown as z.ZodType<Prisma.NoteInclude>;
export const NoteIncludeObjectZodSchema = makeSchema();
