import { useWebInformationStore } from "~/store/webInformation";
import { useWebsiteStore } from "~/store/website";
import { useLanguagesStore } from "~/store/languages";
import { useMenusStore } from "~/store/menus";
import { useUserStore } from "~/store/user";
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
});