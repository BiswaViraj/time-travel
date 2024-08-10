import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  outDir: "dist",
  target: "node16",
  format: ["cjs", "esm", "iife"],
  sourcemap: false,
  clean: true,
  dts: true,
  splitting: true,
  minify: true,
});
