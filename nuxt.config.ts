export default defineNuxtConfig({
	modules: ["@pinia/nuxt"],
	pinia: {
		autoImports: [
			// automatically imports `defineStore`
			"defineStore", // import { defineStore } from 'pinia'
		],
	},
	typescript: {
		typeCheck: true,
	},
	css: [
		"vuetify/styles",
		"@mdi/font/css/materialdesignicons.min.css",
		"~/assets/scss/import.scss",
	],
	build: {
		transpile: ["vuetify", "nuxtErrorHandler"],
	},
	pages: true,
	runtimeConfig: {
		apiSecret: process.env.NUXT_API_SECRET,
		public: { apiBase: process.env.NUXT_PUBLIC_API_BASE || "/api" },
	},
	app: {
		head: {
			link: [
				{
					rel: "icon",
					type: "image/png",
					href: "/favicon.png",
					media: "(prefers-color-scheme: light)",
				},
				{
					rel: "icon",
					type: "image/png",
					href: "/favicon-dark.png",
					media: "(prefers-color-scheme: dark)",
				},
			],
		},
	},
	ignore: ["digitalniweb-custom", "digitalniweb-types", "sequelize"],
});
