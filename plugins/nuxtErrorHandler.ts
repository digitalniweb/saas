export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.config.errorHandler = (error, context) => {
		// nuxt frontend error handler
		return;
	};
});
