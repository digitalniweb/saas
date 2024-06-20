export default defineNuxtConfig({
	modules: ["@pinia/nuxt"],
	components: {
		global: true,
		dirs: ["~/components"],
	},
	typescript: {
		typeCheck: true,
		strict: true,
		tsConfig: {
			compilerOptions: {
				verbatimModuleSyntax: false,
				moduleResolution: "bundler",
				isolatedModules: false,
			},
		},
	},
	css: [
		"vuetify/styles",
		"@mdi/font/css/materialdesignicons.min.css",
		"~/assets/scss/import.scss",
	],
	build: {
		transpile: ["vuetify"],
	},
	pages: true,
	runtimeConfig: {
		apiSecret: process.env.NUXT_API_SECRET,
		public: {
			environment: process.env.NODE_ENV || "development",
			apiBase: process.env.NUXT_PUBLIC_API_BASE || "/api",
			defaultLanguage: process.env.DEFAULT_LANGUAGE || "en",
		},
	},
	app: {
		head: {
			link: [
				{
					rel: "icon",
					type: "image/webp",
					href: "/img/favicon.webp",
					media: "(prefers-color-scheme: light)",
				},
				{
					rel: "icon",
					type: "image/webp",
					href: "/img/favicon-dark.webp",
					media: "(prefers-color-scheme: dark)",
				},
			],
		},
	},
	ignore: ["digitalniweb-custom", "digitalniweb-types", "sequelize"],
	devtools: { enabled: false },
});
