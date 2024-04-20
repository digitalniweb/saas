import { useUserStore } from "~/store/user";
import { useWebInformationStore } from "~/store/webInformation";
import { useWebsiteStore } from "~/store/website";

export default async function <T>(
	request: Parameters<typeof useFetch<T>>[0],
	opts?: Parameters<typeof useFetch<T>>[1]
) {
	const userStore = useUserStore();
	const webInformationStore = useWebInformationStore();
	const website = useWebsiteStore();
	let headers = {
		...opts?.headers,
	} as any;
	if (userStore.user)
		headers.Authorization = `Bearer ${userStore.getToken("access")}`;
	if (
		webInformationStore.data.websiteId &&
		webInformationStore.data.websitesMsId &&
		website.data?.contentMsId
	) {
		headers["x-website-id"] = webInformationStore.data.websiteId;
		headers["x-websites-ms-id"] = webInformationStore.data.websitesMsId;
		headers["x-content-ms-id"] = website.data?.contentMsId;
	}

	let response = await useFetch<T>(request, {
		...opts,
		headers,
	});
	return response;
}
