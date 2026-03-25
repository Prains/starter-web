import * as z from 'zod';

export const NoteScalarFieldEnumSchema = z.enum(['id', 'user_id', 'title', 'content', 'created_at', 'updated_at'])

export type NoteScalarFieldEnum = z.infer<typeof NoteScalarFieldEnumSchema>;