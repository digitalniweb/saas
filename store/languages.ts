import { defineStore } from "pinia";
import { appLanguages, languages } from "~/digitalniweb-types";

export const useLanguagesStore = defineStore("languages", {
	state: () => ({
		appLanguages: {} as appLanguages, // all possible app's mutations
		languages: [] as languages[], // current website's languages
		main: null as languages | null, // current main language id
		current: null as languages | null, // currently picked language
	}),
	getters: {},
	actions: {
		async loadData() {
			let globalDataLanguages = await useFetch("/api/app/languages");

			if (globalDataLanguages.error.value) {
				// I don't know if this can ever get logged out
				// !!! If it does it should get logged by logs_ms
				console.log(
					"useLanguagesStore globalDataLanguages error",
					globalDataLanguages.error.value
				);
			}

			let appLanguages = globalDataLanguages.data.value as appLanguages;

			this.appLanguages = appLanguages ?? [];

			/* let websiteLanguages = await useFetch("/api/website/languages", {
				query: { id: 1 },
			});
			this.languages =
				(websiteLanguages.data.value as unknown as languages[]) ?? []; */
		},
	},
});
