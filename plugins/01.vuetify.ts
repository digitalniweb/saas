import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { cs, en } from "vuetify/locale";

export default defineNuxtPlugin((nuxtApp) => {
	// if (nuxtApp.$skipUrl) return;
	const vuetify = createVuetify({
		components,
		directives,
		ssr: true,

		locale: { locale: "en", fallback: "en", messages: { en, cs } },
	});

	nuxtApp.vueApp.use(vuetify);
	return {
		provide: {
			vuetify,
		},
	};
});
