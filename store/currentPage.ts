import { Language, Module } from "~/digitalniweb-types/models/globalData";
import { useLanguagesStore } from "~/store/languages";
import { useModulesStore } from "~/store/modules";
import { languages } from "~/digitalniweb-types";
import { InferAttributes } from "sequelize";
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
		},
		admin: false as boolean,
		language: {
			currentId: null as Number | null,
			current: null as InferAttributes<Language> | null, // currently picked language,
		},
		id: null as null | number,
		module: {
			current: null as Module | null,
			modulePageIndex: null as number | null,
			modulePageLanguageIndex: null as number | null,
		},
	}),
	getters: {},
	actions: {
		async init() {
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
					this.language.current =
						languages.$state.appLanguages?.[
							languages.$state.main
						] ?? null;

				const { $vuetify } = useNuxtApp();
				$vuetify.locale.current.value = newLang ?? "en";
			}

			// let key: languages;
			// for (key in languages.$state.appLanguages) {
			// 	if (Object.prototype.hasOwnProperty.call(languages.$state.appLanguages, key)) {
			// 		let lang = languages.$state.appLanguages?.[key];

			// 	}
			// }

			if (this.admin) {
				return;
			}

			// pages (not admin)

			// current module
			let currentModule = null;
			let currentModulePageIndex = null;
			let currentModulePageLanguageIndex = null;
			let articleModule = null; // default module
			try {
				// !!! something is wrong in this try block
				if (modules.globalData.length)
					modulesLoop: for (
						let m = 0;
						m < modules?.globalData?.length;
						m++
					) {
						if (modules.globalData[m].name === "articles")
							articleModule = modules.globalData[m];
						let modulePages = modules.globalData[m]?.ModulePages;
						if (modulePages?.length)
							for (let mp = 0; mp < modulePages?.length; mp++) {
								if (currentRoute === modulePages[mp].url) {
									currentModule = modules.globalData[m];
									currentModulePageIndex = mp;
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
											modulePageLanguages[mpl]
												.LanguageId ==
												this.language.currentId &&
											currentRoute ===
												modulePageLanguages[mpl].url
										)
											currentModulePageLanguageIndex =
												mpl;
									}
								if (currentModule) break modulesLoop;
							}
					}
				this.module.current = currentModule;
				this.module.modulePageIndex = currentModulePageIndex;
				this.module.modulePageLanguageIndex =
					currentModulePageLanguageIndex;
				if (currentModule === null) this.module.current = articleModule;
			} catch (error) {
				console.log(error);
			}
		},
	},
});
