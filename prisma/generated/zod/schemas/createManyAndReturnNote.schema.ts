import type { Prisma } from '../../client/client';
import * as z from 'zod';
import { NoteSelectObjectSchema as NoteSelectObjectSchema } from './objects/NoteSelect.schema';
import { NoteCreateManyInputObjectSchema as NoteCreateManyInputObjectSchema } from './objects/NoteCreateManyInput.schema';

export const NoteCreateManyAndReturnSchema: z.ZodType<Prisma.NoteCreateManyAndReturnArgs> = z.object({ select: NoteSelectObjectSchema.optional(), data: z.union([ NoteCreateManyInputObjectSchema, z.array(NoteCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.NoteCreateManyAndReturnArgs>;

export const NoteCreateManyAndReturnZodSchema = z.object({ select: NoteSelectObjectSchema.optional(), data: z.union([ NoteCreateManyInputObjectSchema, z.array(NoteCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();