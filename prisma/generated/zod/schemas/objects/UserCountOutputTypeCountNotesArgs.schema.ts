import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { NoteWhereInputObjectSchema as NoteWhereInputObjectSchema } from './NoteWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => NoteWhereInputObjectSchema).optional()
}).strict();
export const UserCountOutputTypeCountNotesArgsObjectSchema = makeSchema();
export const UserCountOutputTypeCountNotesArgsObjectZodSchema = makeSchema();
