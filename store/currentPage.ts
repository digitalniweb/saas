import {
	Language,
	Module,
	ModulePage,
	ModulePageLanguage,
} from "~/digitalniweb-types/models/globalData";
import { useLanguagesStore } from "~/store/languages";
import { useModulesStore } from "~/store/modules";
import { useMenusStore } from "~/store/menus";
import { languages } from "~/digitalniweb-types";
import { InferAttributes, InferCreationAttributes, Optional } from "sequelize";
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
		admin: false as boolean,
		language: null as InferAttributes<Language> | null, // currently picked language
		module: {
			current: null as Module | null,
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
	}),
	getters: {},
	actions: {
		async getData() {
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

				const { $vuetify } = useNuxtApp();
				$vuetify.locale.current.value = newLang ?? "en";
			} else {
				this.language =
					languages.$state.appLanguages?.[
						languages.$state.main ?? "en"
					] ?? null;
			}

			this.admin = currentRoute === "admin";
			if (this.admin) currentRoute = routeArray.shift();

			if (this.admin) {
				// if (menuStore.admin.length === 0) {
				// 	await menuStore.loadAdminData();
				// }
				return;
			}

			// pages (not admin)
			if (menuStore.articles.length === 0) {
				await menuStore.loadData();
			}

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
