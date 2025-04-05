import type { languages } from "~/digitalniweb-types";
import { useLanguagesStore } from "~/store/languages";
/**
 * /cs|en/:slug - default pages
 * /admin/cs|en/:slug - admin pages
 */
export default defineNuxtRouteMiddleware((to) => {
	const languages = useLanguagesStore();

	// !!! logic of this can be used in recognition of what module this is
	if (to.path == "/") {
		return;
	}
	let path = to.path.slice(1); // to.path always starts with '/'
	let slugs = path.split("/");
	let currentSlug = slugs.shift();
	if (currentSlug === "admin") currentSlug = slugs.shift();
	if (currentSlug === undefined) {
		// set default language
		// needs to be done
		return;
	}
	// load this array from API

	if (languages.languages.includes(currentSlug as languages)) {
		// set given language

		currentSlug = slugs.shift();
	}

	// for modules:
	// try if this slug is module's path. If not then it should be path of 'article' module
});
