import Subscriber from "../../digitalniweb-custom/helpers/subscriberService.js";
import {
	requestServiceRegistryInfo,
	registerCurrentApp,
} from "../../digitalniweb-custom/helpers/serviceRegistryCache.js";
export default defineNitroPlugin(async (nitroApp) => {
	try {
		await Subscriber.psubscribe("serviceRegistry-responseInformation-*"); // handled in registerCurrentApp()
		let serviceRegistryInfo = await requestServiceRegistryInfo();
		if (!serviceRegistryInfo)
			throw new Error("Couldn't get serviceRegistry information.");
		await registerCurrentApp();
	} catch (error) {
		console.log(error);
	}
});
