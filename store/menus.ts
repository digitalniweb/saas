// import { defineStore } from "pinia";

export const useMenusStore = defineStore("menus", {
	state: () => ({
		articles: [] as object[], // main menu with articles (add and change type in here for menu)
		admin: [] as object[],
	}),
	getters: {},
	actions: {
		async loadData() {
			let articlesmenu = await useFetch("/api/website/menu");
			this.articles = articlesmenu?.data?.value ?? [];
		},
	},
});
