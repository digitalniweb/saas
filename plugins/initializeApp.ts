import { useWebInformation } from "~/store/webInformation";
export default defineNuxtPlugin(async (nuxtApp) => {
	const webInformation = useWebInformation();
	await webInformation.loadData();
});
