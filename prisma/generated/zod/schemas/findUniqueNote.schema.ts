import type { Prisma } from '../../client/client';
import * as z from 'zod';
import { NoteSelectObjectSchema as NoteSelectObjectSchema } from './objects/NoteSelect.schema';
import { NoteIncludeObjectSchema as NoteIncludeObjectSchema } from './objects/NoteInclude.schema';
import { NoteWhereUniqueInputObjectSchema as NoteWhereUniqueInputObjectSchema } from './objects/NoteWhereUniqueInput.schema';

export const NoteFindUniqueSchema: z.ZodType<Prisma.NoteFindUniqueArgs> = z.object({ select: NoteSelectObjectSchema.optional(), include: NoteIncludeObjectSchema.optional(), where: NoteWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.NoteFindUniqueArgs>;

export const NoteFindUniqueZodSchema = z.object({ select: NoteSelectObjectSchema.optional(), include: NoteIncludeObjectSchema.optional(), where: NoteWhereUniqueInputObjectSchema }).strict();