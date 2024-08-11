import { buildTreeType } from "~/digitalniweb-custom/helpers/buildTree";
import { useUserStore } from "./user";
import { InferAttributes } from "sequelize";
import { AdminMenu } from "~/digitalniweb-types/models/globalData";
import { Article } from "~/digitalniweb-types/models/content";

export const useMenusStore = defineStore("menus", {
	state: () => ({
		articles: [] as buildTreeType<InferAttributes<Article>>, // main menu with articles (add and change type in here for menu)
		admin: [] as buildTreeType<InferAttributes<AdminMenu>>,
	}),
	getters: {},
	actions: {
		async loadData() {
			// change the type here as well
			const { fetchRef } = useApiCall();
			let articlesMenu = await fetchRef<
				buildTreeType<InferAttributes<Article>>
			>("/api/website/menu");
			this.articles = articlesMenu.data.value ?? [];
		},
		async loadAdminData() {
			if (import.meta.server) return;
			const user = useUserStore();
			const { fetchData } = useApiCall();
			let adminMenu = await fetchData<
				buildTreeType<InferAttributes<AdminMenu>>
			>("/api/website/adminmenu");

			this.admin = adminMenu ?? [];

			/*
			// this doesn't work. Data won't load immediatelly, need to use .refresh() of the useFetch() returned object to get the data
			if (import.meta.server) return;
			const user = useUserStore();
			const { fetchData, fetchRef } = useApiCall();
			// await nextTick(); // this fixes problem with pending useFetch() in useApiCall()
			let adminMenu = await fetchRef<object[]>("/api/website/adminmenu", {
				query: { modules: user?.user?.UserModulesIds },
			});
			console.log(adminMenu.data.value);

			this.admin = adminMenu.data.value ?? [];
			*/
		},
	},
});
