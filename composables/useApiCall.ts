import { useUserStore } from "~/store/user";
import { useWebInformationStore } from "~/store/webInformation";

export default function <T>(
	request: Parameters<typeof useFetch<T>>[0],
	opts?: Parameters<typeof useFetch<T>>[1]
) {
	const userStore = useUserStore();
	const webInformationStore = useWebInformationStore();
	let headers = {
		...opts?.headers,
	} as any;
	if (userStore.user)
		headers.Authorization = `Bearer ${userStore.getToken("access")}`;
	if (
		webInformationStore.data.websiteId &&
		webInformationStore.data.websitesMsId
	) {
		headers["x-website-id"] = webInformationStore.data.websiteId;
		headers["x-websites-ms-id"] = webInformationStore.data.websitesMsId;
	}
	return useFetch<T>(request, {
		...opts,
		headers,
	});
}
