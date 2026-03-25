import * as z from 'zod';
export const NoteFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  content: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
  user: z.unknown()
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});