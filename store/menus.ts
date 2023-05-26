import { defineStore } from "pinia";

export const useMenus = defineStore("menus", {
	state: () => ({
		articles: {}, // main menu with articles
	}),
	getters: {},
	actions: {
		async loadData() {
			let articlesmenu = await useFetch("/api/website/menu");
			this.articles = articlesmenu.data.value ?? {};
		},
	},
});
