import { lazy } from "@orpc/server";

export const router = {
  notes: lazy(() => import("./routers/notes")),
};
