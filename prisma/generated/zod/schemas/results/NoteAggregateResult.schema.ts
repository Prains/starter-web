import * as z from 'zod';
export const NoteAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    user_id: z.number(),
    title: z.number(),
    content: z.number(),
    created_at: z.number(),
    updated_at: z.number(),
    user: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    user_id: z.string().nullable(),
    title: z.string().nullable(),
    content: z.string().nullable(),
    created_at: z.date().nullable(),
    updated_at: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    user_id: z.string().nullable(),
    title: z.string().nullable(),
    content: z.string().nullable(),
    created_at: z.date().nullable(),
    updated_at: z.date().nullable()
  }).nullable().optional()});