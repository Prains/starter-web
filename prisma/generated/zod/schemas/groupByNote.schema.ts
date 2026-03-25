import type { Prisma } from '../../client/client';
import * as z from 'zod';
import { NoteWhereInputObjectSchema as NoteWhereInputObjectSchema } from './objects/NoteWhereInput.schema';
import { NoteOrderByWithAggregationInputObjectSchema as NoteOrderByWithAggregationInputObjectSchema } from './objects/NoteOrderByWithAggregationInput.schema';
import { NoteScalarWhereWithAggregatesInputObjectSchema as NoteScalarWhereWithAggregatesInputObjectSchema } from './objects/NoteScalarWhereWithAggregatesInput.schema';
import { NoteScalarFieldEnumSchema } from './enums/NoteScalarFieldEnum.schema';
import { NoteCountAggregateInputObjectSchema as NoteCountAggregateInputObjectSchema } from './objects/NoteCountAggregateInput.schema';
import { NoteMinAggregateInputObjectSchema as NoteMinAggregateInputObjectSchema } from './objects/NoteMinAggregateInput.schema';
import { NoteMaxAggregateInputObjectSchema as NoteMaxAggregateInputObjectSchema } from './objects/NoteMaxAggregateInput.schema';

export const NoteGroupBySchema: z.ZodType<Prisma.NoteGroupByArgs> = z.object({ where: NoteWhereInputObjectSchema.optional(), orderBy: z.union([NoteOrderByWithAggregationInputObjectSchema, NoteOrderByWithAggregationInputObjectSchema.array()]).optional(), having: NoteScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(NoteScalarFieldEnumSchema), _count: z.union([ z.literal(true), NoteCountAggregateInputObjectSchema ]).optional(), _min: NoteMinAggregateInputObjectSchema.optional(), _max: NoteMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.NoteGroupByArgs>;

export const NoteGroupByZodSchema = z.object({ where: NoteWhereInputObjectSchema.optional(), orderBy: z.union([NoteOrderByWithAggregationInputObjectSchema, NoteOrderByWithAggregationInputObjectSchema.array()]).optional(), having: NoteScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(NoteScalarFieldEnumSchema), _count: z.union([ z.literal(true), NoteCountAggregateInputObjectSchema ]).optional(), _min: NoteMinAggregateInputObjectSchema.optional(), _max: NoteMaxAggregateInputObjectSchema.optional() }).strict();