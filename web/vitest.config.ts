import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "node",
    include: ["lib/**/*.test.ts"],
    pool: "forks",
    poolOptions: { forks: { singleFork: true } }, // run in a single process
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
    },
  },
});
