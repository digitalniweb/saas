import type { InferAttributes } from "sequelize";
import type { Website } from "~~/digitalniweb-types/models/websites";

export const useWebsiteStore = defineStore("website", {
	state: () => ({
		data: null as InferAttributes<Website> | null,
	}),
	getters: {},
	actions: {
		async loadData() {
			let requestUrl = useRequestURL();
			const { fetchData } = useApiCall();
			let website = await fetchData<InferAttributes<Website> | null>(
				`/api/website/website?url=${requestUrl.hostname}`
			);
			if (!website) return false;
			this.data = website;
			return website;
		},
	},
});
