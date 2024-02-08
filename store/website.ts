export const useWebsiteStore = defineStore("website", {
	state: () => ({
		data: {},
	}),
	getters: {},
	actions: {
		async loadData() {
			let requestUrl = useRequestURL();
			let website = await useFetch(
				`/api/website/website?url=${requestUrl.hostname}`
			);
			if (!website.data.value) return false;
			this.data = website.data.value ?? {};
		},
	},
});
