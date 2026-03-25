import type { z, ZodType } from "zod";

type ZodObjectSchema<T extends Record<string, unknown>> = ZodType<T, T> & {
  omit: <K extends keyof T>(keys: { [P in K]: true }) => ZodObjectSchema<
    Omit<T, K> & Record<string, unknown>
  >;
  extend: <E extends Record<string, z.ZodTypeAny>>(
    shape: E,
  ) => ZodObjectSchema<T & { [K in keyof E]: z.output<E[K]> } & Record<string, unknown>>;
};

export function getSchema<T extends Record<string, unknown>>(
  schema: z.ZodType<T>,
): ZodObjectSchema<T> {
  return schema as never;
}

export function getArgsSchema<T extends Record<string, unknown>>(
  schema: z.ZodType<T>,
): ZodObjectSchema<Omit<T, "include" | "select">> {
  return getSchema(schema).omit({ include: true, select: true });
}
