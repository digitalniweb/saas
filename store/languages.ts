import { appLanguages, languages } from "~/digitalniweb-types";
import { useWebsiteStore } from "~/store/website";

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
			let appLanguagesFetch = await useFetch<appLanguages>(
				"/api/app/languages"
			);

			if (appLanguagesFetch.error.value) {
				// !!! need to use useFetch('/api/log',{customLogObject}) to call log from backend, this is wrong, otherwise ioredis Publisher complains with 'process.version' error
				// log({
				// 	type: "functions",
				// 	message: "useLanguagesStore appLanguagesFetch error",
				// 	error: appLanguagesFetch.error.value,
				// });
			}

			let appLanguages = appLanguagesFetch.data.value;
			if (!appLanguages) return;

			this.appLanguages = appLanguages;

			const website = useWebsiteStore();

			const config = useRuntimeConfig();
			let key: languages;
			for (key in appLanguages) {
				if (Object.prototype.hasOwnProperty.call(appLanguages, key)) {
					const el = appLanguages[key];
					if (el.id === website.$state.data?.mainLanguageId)
						this.main = key;
				}
			}
			// this.main = config.public.defaultLanguage as languages;
			this.current = this.main;

			/* let websiteLanguages = await useFetch("/api/website/languages", {
				query: { id: 1 },
			});
			this.languages =
				(websiteLanguages.data.value as unknown as languages[]) ?? []; */
		},
	},
});
