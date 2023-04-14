export default defineNuxtConfig({
	modules: ["@pinia/nuxt", "~/modules/appInit"],
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
});
