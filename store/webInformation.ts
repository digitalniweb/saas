import { defineStore } from "pinia";

export const useWebInformation = defineStore("webInformation", {
	state: () => ({
		all: {}, // for all mutations
		en: {},
	}),
	getters: {},
	actions: {
		async loadData() {
			let webInfo = await useFetch("/api/website/webInformation");
			this.en = webInfo.data.value?.en ?? {};
			this.all = webInfo.data.value?.all ?? {};
		},
	},
});
