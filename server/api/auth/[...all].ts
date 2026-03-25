import { defineEventHandler, toWebRequest } from "h3";

import { auth } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  return await auth.handler(toWebRequest(event));
});
