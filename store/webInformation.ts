// import { defineStore } from "pinia";

export const useWebInformationStore = defineStore("webInformation", {
	state: () => ({
		all: {}, // for all mutations
		en: {},
	}),
	getters: {},
	actions: {
		async loadData() {
			let requestUrl = useRequestURL();
			console.log(requestUrl);

			let webInfo = await useFetch(
				`/api/website/webInformation?url=${requestUrl.hostname}`
			);
			if (!webInfo.data.value) return false;
			this.en = webInfo.data.value?.en ?? {};
			this.all = webInfo.data.value?.all ?? {};
		},
	},
});
