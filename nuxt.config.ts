export default defineNuxtConfig({
	modules: ["@pinia/nuxt"],
	typescript: {
		typeCheck: true,
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
});
