import * as z from 'zod';
// prettier-ignore
export const NoteInputSchema = z.object({
    id: z.string(),
    user_id: z.string(),
    title: z.string(),
    content: z.string().optional().nullable(),
    created_at: z.date(),
    updated_at: z.date(),
    user: z.unknown()
}).strict();

export type NoteInputType = z.infer<typeof NoteInputSchema>;
