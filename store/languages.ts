import { defineStore } from "pinia";
import AppLanguage from "~/server/models/apps/appLanguage";

export const useLanguages = defineStore("languages", {
	state: () => ({
		appLanguages: [] as (typeof AppLanguage)[], // all possible app's mutations
		languages: [], // current website's languages
		mainId: null, // current main language id
		currentId: null, // currently picked language
	}),
	getters: {},
	actions: {
		async loadData() {
			let appLanguages = await useFetch<(typeof AppLanguage)[]>(
				"/api/app/languages"
			);
			this.appLanguages = appLanguages.data.value ?? [];
			let websiteLanguages = await useFetch("/api/website/languages");
			this.languages = websiteLanguages.data?.value ?? [];
		},
	},
});
