// import { defineStore } from "pinia";

export const useMenusStore = defineStore("menus", {
	state: () => ({
		articles: [] as object[], // main menu with articles (add and change type in here for menu)
		admin: [] as object[],
	}),
	getters: {},
	actions: {
		async loadData() {
			// change the type here as well
			let articlesMenu = await useApiCall<object[]>("/api/website/menu");
			this.articles = articlesMenu?.data?.value ?? [];
		},
		async loadAdminData() {
			let adminMenu = await useApiCall<object[]>(
				"/api/website/adminmenu"
			);
			this.admin = adminMenu?.data?.value ?? [];
		},
	},
});
