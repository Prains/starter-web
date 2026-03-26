import { describe, expect, it } from "vitest";
import { router } from "../../server/orpc/router";

describe("starter oRPC router", () => {
  it("keeps a minimal public surface for starter scaffolding", () => {
    expect(Object.keys(router)).toEqual([]);
  });
});
