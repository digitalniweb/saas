import { Widget } from "~/digitalniweb-types/models/globalData";
export const useWidgetsStore = defineStore("widgets", {
	state: () => ({
		app: [] as number[],
		globalData: [] as Widget[],
	}),
	getters: {},
	actions: {
		async loadData() {
			// unlike modules, widgets aren't assigned to websites, just apps
			await this.loadAppWidgets();
			await this.loadGlobalWidgets();
		},
		async loadAppWidgets() {
			let appWidgets = await useFetch<number[]>("/api/app/widgets");
			if (!appWidgets.data.value) return false;
			this.app = appWidgets.data.value;
		},
		async loadGlobalWidgets() {
			let ids = this.app.filter((x) => this.app.includes(x));
			let globalDataWidgets = await useFetch<Widget[]>(
				"/api/globalData/widgets",
				{
					query: { ids },
				}
			);
			if (!globalDataWidgets.data.value) return false;
			this.globalData = globalDataWidgets.data.value;
		},
	},
});
