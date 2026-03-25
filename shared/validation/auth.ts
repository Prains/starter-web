import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Use at least 8 characters"),
});

export const registerFormSchema = z.object({
  name: z.string().min(2, "Tell us what to call you"),
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Use at least 8 characters"),
});

export const passwordResetRequestSchema = z.object({
  email: z.email("Enter a valid email address"),
});

export const passwordResetCompletionSchema = z.object({
  newPassword: z.string().min(8, "Use at least 8 characters"),
});

export const verificationRequestSchema = z.object({
  email: z.email("Enter a valid email address"),
});

export const magicLinkRequestSchema = z.object({
  email: z.email("Enter a valid email address"),
});

export type LoginForm = z.output<typeof loginFormSchema>;
export type RegisterForm = z.output<typeof registerFormSchema>;
export type PasswordResetRequestForm = z.output<
  typeof passwordResetRequestSchema
>;
export type PasswordResetCompletionForm = z.output<
  typeof passwordResetCompletionSchema
>;
export type VerificationRequestForm = z.output<
  typeof verificationRequestSchema
>;
export type MagicLinkRequestForm = z.output<typeof magicLinkRequestSchema>;
