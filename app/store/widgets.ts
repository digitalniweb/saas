import type { InferAttributes } from "sequelize";
import type { modules } from "~~/digitalniweb-types/functionality/modules";
import type { modulesWidgetsContent } from "~~/digitalniweb-types/functionality/widgets";
import type { Widget } from "~~/digitalniweb-types/models/globalData";
export const useWidgetsStore = defineStore("widgets", {
	state: () => ({
		app: [] as number[],
		globalData: [] as InferAttributes<Widget>[],
		moduleWidgets: {} as { [key in modules]: InferAttributes<Widget>[] },
		globalDataIdMapCache: {} as {
			[key in number]: InferAttributes<Widget>;
		},
	}),
	getters: {},
	actions: {
		async loadData() {
			// unlike modules, widgets aren't assigned to websites, just apps
			await this.loadAppWidgets();
			await this.loadGlobalWidgets();
		},
		async loadAppWidgets() {
			let appWidgets = await useFetch<number[]>("/api/app/widgets", {
				deep: true,
			});
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
		async loadModuleWidgets(
			module: modules,
			force: boolean = false
		): Promise<InferAttributes<Widget>[]> {
			if (!force && this.moduleWidgets[module])
				return this.moduleWidgets[module];
			const { fetchData } = useApiCall();
			let moduleWidgetsIds = await fetchData<number[]>(
				"/api/globalData/moduleWidgets",
				{
					query: { module },
				}
			);
			if (!moduleWidgetsIds) return [];
			let moduleWidgets = this.globalData.filter((widget) =>
				moduleWidgetsIds.includes(widget.id)
			);
			this.moduleWidgets[module] = moduleWidgets;
			return moduleWidgets;
		},
		getWidgetById(widgetId: number) {
			if (this.globalDataIdMapCache[widgetId])
				return this.globalDataIdMapCache[widgetId];
			let currentWidget = this.globalData.find((e) => e.id === widgetId);
			if (currentWidget)
				this.globalDataIdMapCache[widgetId] = currentWidget;
			return currentWidget;
		},
		getWidgetsContentTitle(moduleWidget: modulesWidgetsContent) {
			let widget = this.getWidgetById(moduleWidget.widgetId);
			if (!widget) return "";
			if (
				widget.model &&
				moduleWidget[widget.model] &&
				moduleWidget[widget.model]?.name
			)
				return moduleWidget[widget.model]?.name;
			return widget?.name ?? "";
		},
	},
});
