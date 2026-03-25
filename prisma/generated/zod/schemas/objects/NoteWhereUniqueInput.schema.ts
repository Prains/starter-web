import * as z from 'zod';
import type { Prisma } from '../../../client/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const NoteWhereUniqueInputObjectSchema: z.ZodType<Prisma.NoteWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.NoteWhereUniqueInput>;
export const NoteWhereUniqueInputObjectZodSchema = makeSchema();
