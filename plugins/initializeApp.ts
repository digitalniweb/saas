import { useWebInformation } from "~/store/webInformation";
import { useLanguages } from "~/store/languages";
import { useMenus } from "~/store/menus";
export default defineNuxtPlugin(async (nuxtApp) => {
	const webInformation = useWebInformation();
	await webInformation.loadData();

	const languages = useLanguages();
	await languages.loadData();

	const articleMenu = useMenus();
	await articleMenu.loadData();
});
