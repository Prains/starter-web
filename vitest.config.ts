export default {
  test: {
    environment: "node",
    globals: true,
    include: ["test/**/*.test.ts"],
    exclude: [
      ".git/**",
      ".nuxt/**",
      ".output/**",
      "dist/**",
      "node_modules/**",
    ],
    clearMocks: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
  },
};
