import Subscriber from "./../digitalniweb-custom/helpers/subscriberService.js";
import {
	registerCurrentMicroservice,
	requestServiceRegistryInfo,
	registerCurrentApp,
} from "./../digitalniweb-custom/helpers/serviceRegistryCache.js";

export default defineNuxtPlugin(async (nuxtApp) => {
	/* await Subscriber.psubscribe("serviceRegistry-responseInformation-*"); // handled in registerCurrentService()
	let serviceRegistryInfo = await requestServiceRegistryInfo();
	if (!serviceRegistryInfo)
		throw new Error("Couldn't get serviceRegistry information.");
	await registerCurrentApp(); */
});
