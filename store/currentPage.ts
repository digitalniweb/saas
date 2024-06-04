import {
	Language,
	Module,
	ModulePage,
	ModulePageLanguage,
} from "~/digitalniweb-types/models/globalData";
import { useLanguagesStore } from "~/store/languages";
import { useModulesStore } from "~/store/modules";
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
			const skipURLsStarting = [
				"__nuxt",
				"css",
				"images",
				"img",
				"files",
			];
			const skipURL = skipURLsStarting.some((url) => {
				let regex = new RegExp("^/" + url);
				return regex.test(this.route.pathname);
			});
			if (skipURL) return;

			let routeArray = this.route.pathname.split("/");
			routeArray.shift(); // first value is always "", remove it
			let currentRoute = routeArray.shift();
			this.admin = currentRoute === "admin";
			if (this.admin) currentRoute = routeArray.shift();
			if (languages.$state.languages.length !== 1) {
				let currentLang = currentRoute as languages;
				let newLang: languages | null;
				if (this.route.pathname == "/") {
					newLang = languages.$state.main;
				} else {
					if (
						languages.$state?.appLanguages?.[currentLang] !==
						undefined
					)
						newLang = currentLang;
					else newLang = languages.$state.main;
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

			if (this.admin) {
				return;
			}

			// pages (not admin)

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
					m < modules?.globalData?.length;
					m++
				) {
					if (modules.globalData[m].name === "articles") {
						articleModule = modules.globalData[m];
						articleComponent =
							modules.globalData[m].component ?? null;
					}
					let modulePages = modules.globalData[m]?.ModulePages;
					if (modulePages?.length)
						for (let mp = 0; mp < modulePages?.length; mp++) {
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
									mpl < modulePageLanguages?.length;
									mpl++
								) {
									if (
										modulePageLanguages[mpl].LanguageId ==
											this.language?.id &&
										currentRoute ===
											modulePageLanguages[mpl].url
									) {
										currentModulePageLanguage =
											modulePageLanguages[mpl];
										currentModulePage = modulePages[mp];
										break modulesLoop;
									}
								}
							if (currentModule) break modulesLoop;
						}
				}
			this.module.current = currentModule;
			this.module.currentModulePage = currentModulePage ?? null;
			this.module.currentModulePageLanguage =
				currentModulePageLanguage ?? null;
			this.module.currentComponent = currentModuleComponent ?? null;
			if (currentModule === null) {
				this.module.current = articleModule;
				this.module.currentComponent = articleComponent;
			}
		},
	},
});
