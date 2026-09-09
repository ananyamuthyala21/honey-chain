import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  root: import.meta.dirname,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  test: {
    include: ["server/**/*.test.ts"],
    environment: "node",
  },
});
