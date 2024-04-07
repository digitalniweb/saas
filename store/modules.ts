import { Module } from "~/digitalniweb-types/models/globalData";
import { useWebInformationStore } from "./webInformation";
export const useModulesStore = defineStore("modules", {
	state: () => ({
		app: [] as number[],
		website: [] as number[],
		globalData: [] as Module[],
	}),
	getters: {},
	actions: {
		async loadData() {
			await this.loadWebsiteModules();
			await this.loadAppModules();
			await this.loadGlobalModules();
		},
		async loadAppModules() {
			let appModules = await useFetch<number[]>("/api/app/modules");
			if (!appModules.data.value) return false;
			this.app = appModules.data.value;
		},
		async loadWebsiteModules() {
			const webInformation = useWebInformationStore();
			let websiteModules = await useFetch<number[]>(
				`/api/website/modules?websitesMsId=${webInformation.data?.websitesMsId}&websiteId=${webInformation.data?.websiteId}`
			);

			if (!websiteModules.data.value) return false;
			this.website = websiteModules.data.value;
		},
		async loadGlobalModules() {
			let ids = this.app.filter((x) => this.website.includes(x));
			let globalDataModules = await useFetch<Module[]>(
				"/api/globalData/modules",
				{
					query: { ids },
				}
			);
			if (!globalDataModules.data.value) return false;
			this.globalData = globalDataModules.data.value;
		},
	},
});
