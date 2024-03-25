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
			const webInformation = useWebInformationStore();
			let websiteModules = await useFetch<number[]>(
				`/api/website/modules?websitesMsId=${webInformation.data?.websitesMsId}&id=${webInformation.data?.websiteId}`
			);

			if (!websiteModules.data.value) return false;
			this.website = websiteModules.data.value;
		},
	},
});
