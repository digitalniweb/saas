import { useWebInformationStore } from "~/store/webInformation";
import { useWebsiteStore } from "~/store/website";
import { useLanguagesStore } from "~/store/languages";
import { useMenusStore } from "~/store/menus";
import { useUserStore } from "~/store/user";
export default defineNuxtPlugin(async (nuxtApp) => {
	throw createError({
		statusCode: 404,
		statusMessage: "Website doesn't exist.",
		fatal: false,
		data: {
			showRedirectButton: false,
		},
	});
	const website = useWebsiteStore();
	await website.loadData();

	const userStore = useUserStore();
	await userStore.verifyAccessToken();

	const webInformation = useWebInformationStore();
	await webInformation.loadData();

	const languages = useLanguagesStore();
	await languages.loadData();

	const articleMenu = useMenusStore();
	await articleMenu.loadData();
});
