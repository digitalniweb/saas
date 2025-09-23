import type { Module } from "~~/digitalniweb-types/models/globalData";
import { useWebInformationStore } from "./webInformation";
import type { InferAttributes } from "sequelize";
import type { modules } from "~~/digitalniweb-types/functionality/modules";
export const useModulesStore = defineStore("modules", {
	state: () => ({
		app: [] as number[],
		website: [] as number[],
		globalData: [] as InferAttributes<Module>[],
	}),
	getters: {},
	actions: {
		async loadData() {
			await Promise.all([
				this.loadWebsiteModules(),
				this.loadAppModules(),
			]);
			await this.loadGlobalModules();
		},
		async loadAppModules() {
			let appModules = await useFetch<number[]>("/api/app/modules", {
				deep: true,
			});
			if (!appModules.data.value) return false;
			this.app = appModules.data.value;
		},
		async loadWebsiteModules() {
			const webInformation = useWebInformationStore();
			let websiteModules = await useFetch<number[]>(
				`/api/website/modules?websitesMsId=${webInformation.data?.websitesMsId}&websiteId=${webInformation.data?.websiteId}`,
				{
					deep: true,
				}
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
		getModule(moduleName: modules) {
			return this.globalData.find((e) => e.name == moduleName);
		},
		hasWebsiteModule(moduleName: modules) {
			let foundModule = this.getModule(moduleName);
			if (!foundModule) return false;
			return !!this.website.includes(foundModule.id);
		},
		/**
		 * Website has to have all modules from list = AND
		 */
		hasWebsiteModules(moduleNames: modules[]) {
			for (let index = 0; index < moduleNames.length; index++) {
				const module = moduleNames[index];
				if (!this.hasWebsiteModule(module)) return false;
			}
			return true;
		},
		/**
		 * Website has to have at least one module from list = OR
		 */
		hasSomeWebsiteModules(moduleNames: modules[]) {
			for (let index = 0; index < moduleNames.length; index++) {
				const module = moduleNames[index];
				if (this.hasWebsiteModule(module)) return true;
			}
			return false;
		},
	},
});
