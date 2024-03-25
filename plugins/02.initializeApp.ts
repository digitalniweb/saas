import { useWebInformationStore } from "~/store/webInformation";
import { useWebsiteStore } from "~/store/website";
import { useLanguagesStore } from "~/store/languages";
import { useMenusStore } from "~/store/menus";
import { useUserStore } from "~/store/user";
import { useModulesStore } from "~/store/modules";
import { languages } from "~/digitalniweb-types";
export default defineNuxtPlugin(async (nuxtApp) => {
	const website = useWebsiteStore();
	if (!(await website.loadData())) {
		throw createError({
			statusCode: 404,
			statusMessage: "Website doesn't exist.",
			fatal: false,
			data: {
				showRedirectButton: false,
			},
		});
	}

	const userStore = useUserStore();
	await userStore.verifyAccessToken();

	const webInformation = useWebInformationStore();
	await webInformation.loadData();

	const languages = useLanguagesStore();
	await languages.loadData();

	const articleMenu = useMenusStore();
	await articleMenu.loadData();

	const modules = useModulesStore();
	await modules.loadData();

	// deconstruct current url
	// current language
	let route = useRequestURL();
	// let isAdminRoute = /^\/admin\//.test(route.pathname);
	if (languages.$state.languages.length !== 1) {
		let slugFirstRoute = route.pathname.split("/")[1] as languages;
		let newLang: languages | null;
		if (route.pathname == "/") {
			newLang = languages.$state.main;
		} else {
			if (
				languages.$state?.appLanguages?.[
					slugFirstRoute as languages
				] !== undefined
			)
				newLang = slugFirstRoute;
			else newLang = languages.$state.main;
		}

		languages.$state.current = newLang;

		const { $vuetify } = useNuxtApp();
		$vuetify.locale.current.value = newLang ?? "en";
	}

	// current module
	/* let moduleTranslation = "";
	let moduleInfo = {};
	let pageType = await (async function () {
		if (route.pathname == "/") {
			return "articles";
		}
		let routeSegments = route.pathname.split("/");
		if (routeSegments[1] === "api")
			return error({ statusCode: 404, message: "Not found" });
		let modulePage = "";
		// I already have current language due to languageSwitcher middleware, now I need to know what route to go to
		moduleTranslation =
			store.state.language.current !== store.state.language.default
				? routeSegments[2]
				: routeSegments[1];
		modulePage =
			store.state.modules?.pages[store.state.language.current][
				moduleTranslation
			];
		if (modulePage) {
			if (
				store.state.modules?.pages[store.state.language.current][
					moduleTranslation
				].info === undefined
			) {
				// this works fine, but is nowhere to be seen in Vue (->vuex) plugin (extension) in (any) browser for some reason (I guess it's because it's deeply nested object and recursive function is used)
				// It works when I go from any other page to "module" page (when I navigate through pages). It just "doesn't work" on refresh (on initial load)
				await store.dispatch("getModuleInfo", modulePage.name);
			}
			moduleInfo =
				store.state.modules?.pages[store.state.language.current][
					moduleTranslation
				].info;
			return modulePage.name;
		}
		return "articles";
	})();
	if (
		store.state.modules?.all[pageType] &&
		store.state.modules?.all[pageType]?.scope?.length !== 0
	) {
		if (
			!store.$auth.user ||
			!store.state.modules?.all[pageType].scope.some((scope) =>
				store.$auth.user.scope.includes(scope)
			)
		) {
			return redirect(
				getModulePath(store, {
					module: "login",
					query: {
						redirect: route.pathname,
					},
					returnString: true,
				})
			);
		}
	}
	let pageData = {};
	// GET type: /api/pageType/id/slug?query
	// or /api/pageType/?query
	let urlQuery = route.fullPath.split("?");
	urlQuery = urlQuery[1] ? `?${urlQuery[1]}` : "";
	let urlData = "";
	if (pageType == "articles") {
		await store.dispatch("getArticleData", { url: route.pathname });
		if (!store.state.article)
			return error({ statusCode: 404, message: "Article not found" });
	} else if (
		store.state?.modules?.all[pageType] &&
		store.state?.modules?.all[pageType].dedicatedTable
	) {
		try {
			urlData = route.pathname.split(moduleTranslation)[1];
			let modulePageData = await store.dispatch("getModuleData", {
				pageType,
				urlData,
				urlQuery,
			});
			if (!modulePageData.data)
				return error({ statusCode: 404, message: "Not found" });
			pageData = modulePageData.data;
		} catch (err) {
			return error({ statusCode: 404, message: "Not found" });
		}
	} */
});
