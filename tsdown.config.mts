import { defineConfig } from "tsdown";

const entry = {
	index: "src/index.ts",
};

export default defineConfig([
	{
		clean: true,
		dts: {
			sourcemap: true,
		},
		entry,
		format: ["esm", "cjs"],
		minify: false,
		outDir: "dist",
		platform: "neutral",
		sourcemap: true,
		target: "es2020",
	},
	{
		clean: false,
		entry,
		format: ["iife"],
		globalName: "TimeTravel",
		minify: true,
		outDir: "dist",
		platform: "browser",
		sourcemap: true,
		target: "es2020",
	},
]);
