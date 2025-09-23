import { useWebInformationStore } from "~/store/webInformation";
import { useWebsiteStore } from "~/store/website";
import { useLanguagesStore } from "~/store/languages";
import { useUserStore } from "~/store/user";
import { useModulesStore } from "~/store/modules";
import { useWidgetsStore } from "~/store/widgets";
import { useCurrentPageStore } from "~/store/currentPage";
export default defineNuxtPlugin(async (nuxtApp) => {
	// if (nuxtApp.$skipUrl) return;

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

	const modules = useModulesStore();

	const widgets = useWidgetsStore();

	await Promise.all([modules.loadData(), widgets.loadData()]);

	const currentPage = useCurrentPageStore();
	await currentPage.getData();
});
