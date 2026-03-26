// Keep the root router available so generated projects already have a working
// /rpc endpoint and typed client wiring. Product/domain procedures are removed
// from the public starter and can be added back incrementally by the user.
export const router = {} as const;
