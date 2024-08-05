import { useUserStore } from "~/store/user";
import { useWebInformationStore } from "~/store/webInformation";
import { useWebsiteStore } from "~/store/website";
import { useCurrentPageStore } from "~/store/currentPage";
import isObjectEmpty from "~/digitalniweb-custom/functions/isObjectEmpty";
import { filterStoreparams } from "~/custom/users";

import { resourceIdsType } from "~/digitalniweb-types/apps/communication";
import { tokensJWT, userLoginResponse } from "~/digitalniweb-types/users";

/**
 * Uses '$fetch' - returns requested data immediately in response
 *
 * Use when fetching client-only data = when authentication is needed
 *
 * 4xx, 5xx http response status code throws error
 */
export const useApiCall = () => {
	const fetchData = async <T>(
		request: Parameters<typeof $fetch<T>>[0],
		opts?: Parameters<typeof $fetch<T>>[1]
	) => {
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

		if (website.data?.appId) resourceIds.appId = website.data?.appId;

		if (currentPage.module.current?.id)
			resourceIds.moduleId = currentPage.module.current?.id;

		if (currentPage.language?.id)
			resourceIds.languageId = currentPage.language?.id;

		if (!isObjectEmpty(resourceIds)) {
			if (!opts) opts = {};
			if (!opts.params) opts.params = {};
			(opts.params as Record<string, any>).resourceIds = resourceIds;
		}

		try {
			let response = await $fetch<T>(request, {
				...opts,
				headers,
			});

			return response;
		} catch (error: any) {
			if (error.statusMessage === "Token expired") {
				try {
					let refreshToken = userStore.getToken("refresh");

					let user = await $fetch<userLoginResponse>(
						"/api/user/verifyRefreshToken",
						{
							method: "POST",
							body: { refreshToken } as tokensJWT,
						}
					);
					userStore.setToken(user.access_token, "access");
					userStore.user = filterStoreparams(user);

					headers.Authorization = `Bearer ${userStore.getToken(
						"access"
					)}`;

					let response = await $fetch<T>(request, {
						...opts,
						headers,
					});

					return response;
				} catch (error) {
					console.log(error);
					throw error;
				}
			}
			// throw error;
		}
	};

	/**
	 * uses 'useFetch' - returns data in wrapper -> response.data.value
	 *
	 * use when fetching ssr data inside .vue components, composables etc.
	 *
	 * 4xx, 5xx http response status code doesn't throw error
	 */
	const fetchRef = async <T>(
		request: Parameters<typeof useFetch<T>>[0],
		opts?: Parameters<typeof useFetch<T>>[1]
	) => {
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

		if (website.data?.appId) resourceIds.appId = website.data?.appId;

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
	};

	return { fetchData, fetchRef };
};
