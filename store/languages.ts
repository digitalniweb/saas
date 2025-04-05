import type { appLanguages, languages } from "~/digitalniweb-types";
import { useWebsiteStore } from "~/store/website";
import { useWebInformationStore } from "./webInformation";

export const useLanguagesStore = defineStore("languages", {
	state: () => ({
		appLanguages: {} as appLanguages | null, // all possible app's mutations
		languages: [] as languages[], // current website's languages
		main: null as languages | null, // current main language id
		// current language is in 'currentPage' store
	}),
	getters: {},
	actions: {
		async loadData() {
			let appLanguagesFetch =
				await useFetch<appLanguages>("/api/app/languages");

			if (appLanguagesFetch.error.value) {
				// ! need to use useFetch('/api/log',{customLogObject}) to call log from backend, this is wrong, otherwise ioredis Publisher complains with 'process.version' error
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

			const webInformation = useWebInformationStore();
			let websiteLanguageIds = await useFetch<number[]>(
				`/api/website/languages?websitesMsId=${webInformation.data?.websitesMsId}&websiteId=${webInformation.data?.websiteId}`
			);

			if (!websiteLanguageIds.data.value) return false;

			let key: languages;
			for (key in appLanguages) {
				if (Object.prototype.hasOwnProperty.call(appLanguages, key)) {
					const el = appLanguages[key];
					if (el.id === website.$state.data?.mainLanguageId)
						this.main = key;
					if (
						websiteLanguageIds.data.value.includes(el.id) &&
						!this.languages.includes(el.code)
					)
						this.languages.push(el.code);
				}
			}
		},
	},
});
