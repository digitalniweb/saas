import type {
	AdminMenu,
	AdminMenuLanguage,
	Language,
	Module,
	ModulePage,
	ModulePageLanguage,
} from "~~/digitalniweb-types/models/globalData";
import { useLanguagesStore } from "~/store/languages";
import { useModulesStore } from "~/store/modules";
import { useMenusStore } from "~/store/menus";
import type { languages } from "~~/digitalniweb-types";
import type {
	InferAttributes,
	InferCreationAttributes,
	Optional,
} from "sequelize";
import type {
	buildTreeType,
	TreeNode,
} from "~~/digitalniweb-custom/helpers/buildTree";
import { useWebInformationStore } from "./webInformation";
import getObjectFromArray from "~~/digitalniweb-custom/functions/getObjectFromArray";
const queryParamsKeys = ["page", "limit", "offset", "search"] as const;
type queryParamsTypes = {
	page: number;
	limit: number;
	offset: number;
	search: string;
};

type queryParams = {
	[K in (typeof queryParamsKeys)[number]]: queryParamsTypes[K];
};

export const useCurrentPageStore = defineStore("currentPage", {
	state: () => ({
		route: {
			pathname: "",
			queryString: "",
			query: {} as queryParams,
			id: null as null | number,
		},
		admin: {
			isAdmin: false as boolean,
			currentAdminMenu: null as TreeNode<
				InferAttributes<AdminMenu>
			> | null,
			currentComponent: null as string | null,
			currentAdminMenuLanguage: null as AdminMenuLanguage | null,
		},
		language: null as InferAttributes<Language> | null, // currently picked language
		module: {
			current: null as InferAttributes<Module> | null,
			currentModulePage: null as Optional<
				InferCreationAttributes<ModulePage>,
				"id" | "ModuleId"
			> | null,
			currentModulePageLanguage: null as Optional<
				InferCreationAttributes<ModulePageLanguage>,
				"id" | "ModulePageId" | "LanguageId"
			> | null,
			currentComponent: null as string | null,
		},
		page: {
			title: "" as string,
			description: "" as string,
		},
		disabled: false,
	}),
	getters: {},
	actions: {
		setAdminModule(
			menuLevel: buildTreeType<InferAttributes<AdminMenu>>,
			wantedUrl: string,
			level = 0
		): boolean {
			if (wantedUrl === "") {
				this.admin.currentAdminMenu = null;
				this.admin.currentComponent = "AdminPages";
				this.admin.currentAdminMenuLanguage = null;
				return true;
			}
			let wantedUrlArray = wantedUrl.split("/");
			let currentUrl = wantedUrlArray.slice(0, level + 1).join("/");

			for (let index = 0; index < menuLevel.length; index++) {
				let currentMenuLevel = menuLevel[index];
				let AdminMenuLanguage =
					currentMenuLevel.AdminMenuLanguages?.find(
						(e) => e.LanguageId === this.language?.id
					);
				if (!AdminMenuLanguage) continue;
				if (AdminMenuLanguage.url === wantedUrl) {
					this.admin.currentAdminMenu = currentMenuLevel;
					this.admin.currentComponent =
						currentMenuLevel.component ?? null;
					this.admin.currentAdminMenuLanguage = AdminMenuLanguage;
					return true;
				}
				if (
					AdminMenuLanguage.url === currentUrl &&
					currentMenuLevel.children
				) {
					return this.setAdminModule(
						currentMenuLevel.children!,
						wantedUrl,
						++level
					);
				}
			}
			return false;
		},
		async getAdminData() {
			let websiteStore = useWebInformationStore();
			// set pages data to null
			this.module.current = null;
			this.module.currentComponent = null;
			this.module.currentModulePage = null;
			this.module.currentModulePageLanguage = null;

			this.admin.isAdmin = true;
			this.page.description = "";
			this.page.title = "";

			let url = useRequestURL();
			this.route.pathname = url.pathname.slice("/admin/".length);
			const menuStore = useMenusStore();
			if (menuStore.admin.length === 0) {
				await menuStore.loadAdminData();
			}

			let setAdminMenu = this.setAdminModule(
				menuStore.admin,
				this.route.pathname
			);

			this.page.title =
				(this.admin.currentAdminMenuLanguage?.name
					? this.admin.currentAdminMenuLanguage?.name + " - "
					: "") +
				"Admin | " +
				websiteStore.data.name;
			if (!setAdminMenu) {
				console.log(404);
			}
		},
		async getData() {
			// set admin data to null
			this.admin.isAdmin = false;
			this.admin.currentAdminMenu = null;
			this.admin.currentAdminMenuLanguage = null;

			const languages = useLanguagesStore();
			const modules = useModulesStore();
			let url = useRequestURL();

			this.route.pathname = url.pathname;
			this.route.queryString = url.search.slice(1);
			if (this.route.queryString) {
				const urlParams = new URLSearchParams(this.route.queryString);

				for (const key of queryParamsKeys) {
					if (urlParams.has(key)) {
						let value = urlParams.get(key);
						if (value !== null)
							if (key === "search") {
								// string
								this.route.query[key] = value;
							} else {
								// number
								let valueInt = parseInt(value);
								if (valueInt) this.route.query[key] = valueInt;
							}
					}
				}
			}

			const menuStore = useMenusStore();

			let routeArray = this.route.pathname.split("/");
			routeArray.shift(); // first value is always "", remove it
			let currentRoute = routeArray.shift();

			const { $vuetify } = useNuxtApp();
			$vuetify.locale.current.value = this.language?.code ?? "en";

			if (languages.$state.languages.length !== 1) {
				let currentLang = currentRoute as languages;
				let newLang: languages | null;
				if (this.route.pathname == "/") {
					newLang = languages.$state.main;
				} else {
					if (
						languages.$state?.appLanguages?.[currentLang] !==
						undefined
					) {
						newLang = currentLang;
						currentRoute = routeArray.shift();
					} else newLang = languages.$state.main;
				}

				if (languages.$state.main)
					this.language =
						languages.$state.appLanguages?.[
							languages.$state.main
						] ?? null;

				$vuetify.locale.current.value = newLang ?? "en";
			} else {
				this.language =
					languages.$state.appLanguages?.[
						languages.$state.main ?? "en"
					] ?? null;
			}

			// this block should never happen and I should remove it
			// this.admin.isAdmin = currentRoute === "admin";
			// if (this.admin.isAdmin) currentRoute = routeArray.shift();
			// if (this.admin.isAdmin) {
			// 	return;
			// }

			// pages (not admin)
			if (menuStore.articles.length === 0) await menuStore.loadData();
			let article = getObjectFromArray(
				this.route.pathname,
				menuStore.articles,
				-1,
				{ key: "url", children: "children" }
			);
			if (article) this.route.id = article.id;

			// current module
			let currentModule = null;
			let currentModulePage = null;
			let currentModulePageLanguage = null;
			let currentModuleComponent = null;
			let articleModule = null; // default module
			let articleComponent = null; // default component

			if (modules.globalData.length)
				modulesLoop: for (
					let m = 0;
					m < modules?.globalData.length;
					m++
				) {
					if (modules.globalData[m].name === "articles") {
						articleModule = modules.globalData[m];
						articleComponent =
							modules.globalData[m].component ?? null;
					}
					let modulePages = modules.globalData[m]?.ModulePages;
					if (modulePages?.length)
						for (let mp = 0; mp < modulePages.length; mp++) {
							if (currentRoute === modulePages[mp].url) {
								currentModule = modules.globalData[m];
								currentModulePage = modulePages[mp];
								currentModuleComponent =
									modulePages[mp]?.component ??
									modules.globalData[m]?.component ??
									null;
							}
							const modulePageLanguages =
								modulePages[mp].ModulePageLanguages;
							if (modulePageLanguages?.length)
								for (
									let mpl = 0;
									mpl < modulePageLanguages.length;
									mpl++
								) {
									if (
										modulePageLanguages[mpl].LanguageId ==
											this.language?.id &&
										currentRoute ===
											modulePageLanguages[mpl].url
									) {
										currentModule = modules.globalData[m];
										currentModulePage = modulePages[mp];
										currentModulePageLanguage =
											modulePageLanguages[mpl];
										currentModulePage = modulePages[mp];
										currentModuleComponent =
											modulePages[mp]?.component ??
											modules.globalData[m]?.component ??
											null;
										break modulesLoop;
									}
								}
							if (currentModule) break modulesLoop;
						}
				}

			this.module.current = currentModule;
			this.module.currentComponent = currentModuleComponent;
			this.module.currentModulePage = currentModulePage;
			this.module.currentModulePageLanguage = currentModulePageLanguage;
			if (currentModule === null) {
				this.module.current = articleModule;
				this.module.currentComponent = articleComponent;
			}
		},
	},
});
