import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createORPCVueColadaUtils } from "@orpc/vue-colada";
import type { RouterClient } from "@orpc/server";
import type { router } from "~~/server/orpc/router";
import { useRequestFetch, useRequestURL } from "#imports";

function getRPCUrl() {
  if (import.meta.server) {
    const requestUrl = useRequestURL();

    return `${requestUrl.origin}/rpc`;
  }

  return "/rpc";
}

function getRPCFetch() {
  if (import.meta.server) {
    return useRequestFetch() as typeof fetch;
  }

  return undefined;
}

export function useORPCClient(): RouterClient<typeof router> {
  const customFetch = getRPCFetch();
  const link = new RPCLink({
    url: getRPCUrl(),
    ...(customFetch ? { fetch: customFetch } : {}),
  });

  return createORPCClient(link);
}

export function useORPC() {
  return createORPCVueColadaUtils(useORPCClient());
}
