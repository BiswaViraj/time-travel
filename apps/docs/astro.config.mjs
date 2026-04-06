// @ts-check

import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightThemeRapide from "starlight-theme-rapide";

export default defineConfig({
	base: "/time-travel",
	integrations: [
		starlight({
			customCss: ["./src/styles/custom.css"],
			plugins: [starlightThemeRapide()],
			sidebar: [
				{ label: "Getting Started", slug: "getting-started" },
				{
					autogenerate: { directory: "api" },
					label: "API Reference",
				},
				{ label: "Examples", slug: "examples" },
			],
			social: [
				{
					href: "https://github.com/BiswaViraj/time-travel",
					icon: "github",
					label: "GitHub",
				},
				{
					href: "https://www.npmjs.com/package/@biswaviraj/time-travel",
					icon: "npm",
					label: "NPM",
				},
			],
			title: "Time Travel",
		}),
	],
	site: "https://biswaviraj.github.io",
});
