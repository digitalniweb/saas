import { defineStore } from "pinia";

export const useLanguages = defineStore("languages", {
	state: () => ({
		appLanguages: [], // all possible app's mutations
		languages: [], // current website's languages
		mainId: null, // current main language id
		currentId: null, // currently picked language
	}),
	getters: {},
	actions: {
		async loadData() {
			// let appLanguages = await useFetch("/api/app/languages");
			// this.appLanguages = appLanguages.data.value?.appLanguages ?? [];
			let websiteLanguages = await useFetch("/api/app/languages");
			this.languages = websiteLanguages.data.value?.languages ?? [];
		},
	},
});
