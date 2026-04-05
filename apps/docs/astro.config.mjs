// @ts-check

import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightThemeRapide from "starlight-theme-rapide";

export default defineConfig({
	integrations: [
		starlight({
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
			],
			title: "Time Travel",
		}),
	],
});
