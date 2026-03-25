import { RPCHandler } from "@orpc/server/fetch";
import { defineEventHandler, setResponseStatus, toWebRequest } from "h3";

import { prisma } from "../../../prisma/client";
import { router } from "../../orpc/router";
import { auth } from "../../utils/auth";

const handler = new RPCHandler(router);

export default defineEventHandler(async (event) => {
  const request = toWebRequest(event);
  const sessionData = await auth.api.getSession(request);
  const { response } = await handler.handle(request, {
    prefix: "/rpc",
    context: {
      request,
      prisma,
      ...(sessionData?.session && sessionData.user
        ? {
            session: {
              id: sessionData.session.id,
              userId: sessionData.session.userId,
              expiresAt: new Date(sessionData.session.expiresAt),
            },
            user: {
              id: sessionData.user.id,
              email: sessionData.user.email,
              name: sessionData.user.name,
              emailVerified: sessionData.user.emailVerified,
              image: sessionData.user.image ?? null,
            },
          }
        : {}),
    },
  });

  if (response) {
    return response;
  }

  setResponseStatus(event, 404, "Not Found");

  return "Not found";
});
