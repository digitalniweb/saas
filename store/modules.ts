import { InferAttributes } from "sequelize";
import { WebsiteModule } from "~/digitalniweb-types/models/websites";
import { Module } from "~/digitalniweb-types/models/globalData";
export const useModulesStore = defineStore("webInformation", {
	state: () => ({
		// data: {} as InferAttributes<WebsiteModule>,
		appModules: [] as number[],
		websiteModules: [] as number[],
		all: [] as Module[],
	}),
	getters: {},
	actions: {
		async loadData() {},
	},
});
