import { log } from "~/digitalniweb-custom/helpers/logger";
import { appLanguages, languages } from "~/digitalniweb-types";

export const useLanguagesStore = defineStore("languages", {
	state: () => ({
		appLanguages: {} as appLanguages | null, // all possible app's mutations
		languages: [] as languages[], // current website's languages
		main: null as languages | null, // current main language id
		current: null as languages | null, // currently picked language
	}),
	getters: {},
	actions: {
		async loadData() {
			let globalDataLanguages = await useFetch<appLanguages>(
				"/api/app/languages"
			);

			if (globalDataLanguages.error.value) {
				log({
					type: "functions",
					message: "useLanguagesStore globalDataLanguages error",
					error: globalDataLanguages.error.value,
				});
			}

			let appLanguages = globalDataLanguages.data.value;

			this.appLanguages = appLanguages;

			const config = useRuntimeConfig();
			this.main = config.public.defaultLanguage as languages;
			this.current = config.public.defaultLanguage as languages;

			/* let websiteLanguages = await useFetch("/api/website/languages", {
				query: { id: 1 },
			});
			this.languages =
				(websiteLanguages.data.value as unknown as languages[]) ?? []; */
		},
	},
});
