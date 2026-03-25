import type { Prisma } from '../../client/client';
import * as z from 'zod';
import { NoteWhereInputObjectSchema as NoteWhereInputObjectSchema } from './objects/NoteWhereInput.schema';

export const NoteDeleteManySchema: z.ZodType<Prisma.NoteDeleteManyArgs> = z.object({ where: NoteWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.NoteDeleteManyArgs>;

export const NoteDeleteManyZodSchema = z.object({ where: NoteWhereInputObjectSchema.optional() }).strict();