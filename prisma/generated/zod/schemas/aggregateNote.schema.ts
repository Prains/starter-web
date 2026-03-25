import type { Prisma } from '../../client/client';
import * as z from 'zod';
import { NoteOrderByWithRelationInputObjectSchema as NoteOrderByWithRelationInputObjectSchema } from './objects/NoteOrderByWithRelationInput.schema';
import { NoteWhereInputObjectSchema as NoteWhereInputObjectSchema } from './objects/NoteWhereInput.schema';
import { NoteWhereUniqueInputObjectSchema as NoteWhereUniqueInputObjectSchema } from './objects/NoteWhereUniqueInput.schema';
import { NoteCountAggregateInputObjectSchema as NoteCountAggregateInputObjectSchema } from './objects/NoteCountAggregateInput.schema';
import { NoteMinAggregateInputObjectSchema as NoteMinAggregateInputObjectSchema } from './objects/NoteMinAggregateInput.schema';
import { NoteMaxAggregateInputObjectSchema as NoteMaxAggregateInputObjectSchema } from './objects/NoteMaxAggregateInput.schema';

export const NoteAggregateSchema: z.ZodType<Prisma.NoteAggregateArgs> = z.object({ orderBy: z.union([NoteOrderByWithRelationInputObjectSchema, NoteOrderByWithRelationInputObjectSchema.array()]).optional(), where: NoteWhereInputObjectSchema.optional(), cursor: NoteWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), NoteCountAggregateInputObjectSchema ]).optional(), _min: NoteMinAggregateInputObjectSchema.optional(), _max: NoteMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.NoteAggregateArgs>;

export const NoteAggregateZodSchema = z.object({ orderBy: z.union([NoteOrderByWithRelationInputObjectSchema, NoteOrderByWithRelationInputObjectSchema.array()]).optional(), where: NoteWhereInputObjectSchema.optional(), cursor: NoteWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), NoteCountAggregateInputObjectSchema ]).optional(), _min: NoteMinAggregateInputObjectSchema.optional(), _max: NoteMaxAggregateInputObjectSchema.optional() }).strict();