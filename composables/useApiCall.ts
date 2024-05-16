import { useUserStore } from "~/store/user";
import { useWebInformationStore } from "~/store/webInformation";
import { useWebsiteStore } from "~/store/website";
import { useCurrentPageStore } from "~/store/currentPage";
import isObjectEmpty from "~/digitalniweb-custom/functions/isObjectEmpty";

import { resourceIdsType } from "~/digitalniweb-types/apps/communication";

export default async function useApiCall<T>(
	request: Parameters<typeof useFetch<T>>[0],
	opts?: Parameters<typeof useFetch<T>>[1]
) {
	const userStore = useUserStore();
	const webInformationStore = useWebInformationStore();
	const website = useWebsiteStore();
	const currentPage = useCurrentPageStore();
	let headers = {
		...opts?.headers,
	} as any;
	if (userStore.user)
		headers.Authorization = `Bearer ${userStore.getToken("access")}`;

	let resourceIds = {} as resourceIdsType;
	if (webInformationStore.data.websiteId)
		resourceIds.websiteId = webInformationStore.data.websiteId;

	if (webInformationStore.data.websitesMsId)
		resourceIds.websitesMsId = webInformationStore.data.websitesMsId;

	if (website.data?.contentMsId)
		resourceIds.contentMsId = website.data?.contentMsId;

	if (currentPage.module.current?.id)
		resourceIds.moduleId = currentPage.module.current?.id;

	if (currentPage.language?.id)
		resourceIds.languageId = currentPage.language?.id;

	if (!isObjectEmpty(resourceIds)) {
		if (!opts) opts = {};
		if (!opts.params) opts.params = {};
		(opts.params as Record<string, any>).resourceIds = resourceIds;
	}

	let response = await useFetch<T>(request, {
		...opts,
		headers,
	});
	return response;
}
