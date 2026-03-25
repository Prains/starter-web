import * as z from 'zod';
export const NoteDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  content: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
  user: z.unknown()
}));