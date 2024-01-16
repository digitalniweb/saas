import { useWebInformationStore } from "~/store/webInformation";
import { useLanguagesStore } from "~/store/languages";
import { useMenusStore } from "~/store/menus";
import { useUserStore } from "~/store/user";
export default defineNuxtPlugin(async (nuxtApp) => {
	const userStore = useUserStore();
	await userStore.verifyAccessToken();
	const webInformation = useWebInformationStore();
	await webInformation.loadData();

	const languages = useLanguagesStore();
	await languages.loadData();

	const articleMenu = useMenusStore();
	await articleMenu.loadData();
});
