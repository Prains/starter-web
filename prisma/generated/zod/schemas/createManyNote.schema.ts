import type { Prisma } from '../../client/client';
import * as z from 'zod';
import { NoteCreateManyInputObjectSchema as NoteCreateManyInputObjectSchema } from './objects/NoteCreateManyInput.schema';

export const NoteCreateManySchema: z.ZodType<Prisma.NoteCreateManyArgs> = z.object({ data: z.union([ NoteCreateManyInputObjectSchema, z.array(NoteCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.NoteCreateManyArgs>;

export const NoteCreateManyZodSchema = z.object({ data: z.union([ NoteCreateManyInputObjectSchema, z.array(NoteCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();