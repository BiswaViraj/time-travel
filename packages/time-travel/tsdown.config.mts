import { defineConfig } from "tsdown";

const entry = {
	index: "src/index.ts",
	react: "src/react/index.ts",
};

export default defineConfig([
	{
		clean: true,
		dts: {
			sourcemap: true,
		},
		entry,
		external: ["react"],
		format: ["esm", "cjs"],
		minify: false,
		outDir: "dist",
		platform: "neutral",
		sourcemap: true,
		target: "es2020",
	},
	{
		clean: false,
		entry: { index: "src/index.ts" },
		format: ["iife"],
		globalName: "TimeTravel",
		minify: true,
		outDir: "dist",
		platform: "browser",
		sourcemap: true,
		target: "es2020",
	},
]);
