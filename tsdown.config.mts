import { defineConfig } from "tsdown";

const entry = {
  index: "src/index.ts",
};

export default defineConfig([
  {
    entry,
    outDir: "dist",
    clean: true,
    format: ["esm", "cjs"],
    platform: "neutral",
    target: "es2020",
    sourcemap: true,
    dts: {
      sourcemap: true,
    },
    minify: false,
  },
  {
    entry,
    outDir: "dist",
    clean: false,
    format: ["iife"],
    platform: "browser",
    target: "es2020",
    globalName: "TimeTravel",
    sourcemap: true,
    minify: true,
  },
]);
