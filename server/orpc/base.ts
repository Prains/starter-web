import { base } from "./context";

const authMiddleware = base
  .errors({
    UNAUTHORIZED: {
      message: "Authentication is required.",
    },
  })
  .middleware(async ({ context, next, errors }) => {
    if (!context.session || !context.user) {
      throw errors.UNAUTHORIZED();
    }

    return next({
      context: {
        session: context.session,
        user: context.user,
      },
    });
  });

export { base } from "./context";

export const authBase = base.use(authMiddleware);
