import { InferAttributes } from "sequelize";
import { Website } from "~/digitalniweb-types/models/websites";

export const useWebsiteStore = defineStore("website", {
	state: () => ({
		data: null as InferAttributes<Website> | null,
	}),
	getters: {},
	actions: {
		async loadData() {
			let requestUrl = useRequestURL();
			let website = await useFetch<InferAttributes<Website> | null>(
				`/api/website/website?url=${requestUrl.hostname}`
			);
			if (!website.data.value) return false;
			this.data = website.data.value;
			return website.data.value;
		},
	},
});
