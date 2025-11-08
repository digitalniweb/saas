import { consoleLogProduction } from "../../digitalniweb-custom/helpers/logger.js";
import {
	registerCurrentApp,
	requestServiceRegistryInfo,
} from "../../digitalniweb-custom/helpers/serviceRegistryCache.js";
import Subscriber from "../../digitalniweb-custom/helpers/subscriberService.js";

export default defineNitroPlugin(async () => {
	// subscribe now and on connect to everything
	pubSubServiceInitApp();
	Subscriber.on("connect", () => {
		pubSubServiceInitApp();
	});
});

async function pubSubServiceInitApp() {
	try {
		await Subscriber.subscribe("globalDataMessage"); // subscribe to "globalDataMessage" messages from "globalData"
		await Subscriber.psubscribe("serviceRegistry-responseInformation-*"); // handled in registerCurrentApp()

		// register (if not registered already) app after globalData is registered
		Subscriber.on("message", async (channel, message) => {
			if (channel === "globalDataMessage") {
				if (message === "registered") {
					let serviceRegistryInfo =
						await requestServiceRegistryInfo();
					if (!serviceRegistryInfo)
						consoleLogProduction(
							"Couldn't get service registry information.",
							"error"
						);
					try {
						if (!process.env.APP_ID) await registerCurrentApp();
						consoleLogProduction(
							`'${process.env.APP_NAME}' registered on 'globalData registered'.`,
							"success"
						);
					} catch (error) {
						consoleLogProduction(
							`Couldn't register '${process.env.APP_NAME}' after 'globalData registered'.`,
							"error"
						);
					}
				}
			}
		});
		let serviceRegistryInfo = await requestServiceRegistryInfo();
		if (!serviceRegistryInfo)
			throw new Error("Couldn't get serviceRegistry information.");
		await registerCurrentApp();
	} catch (error: any) {
		consoleLogProduction(error, "error", "'appInit' failed.");
	}
}
