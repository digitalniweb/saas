import Subscriber from "../../digitalniweb-custom/helpers/subscriberService.js";
import {
	requestServiceRegistryInfo,
	registerCurrentApp,
} from "../../digitalniweb-custom/helpers/serviceRegistryCache.js";
import type { Website } from "~/digitalniweb-types/models/websites.js";
import type { CreationAttributes } from "sequelize";
import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall.js";
import { consoleLogProduction } from "~/digitalniweb-custom/helpers/logger.js";

export default defineNitroPlugin(async () => {
	try {
		await Subscriber.subscribe("globalDataMessage"); // subscribe to "globalDataMessage" messages from "globalData"
		await Subscriber.psubscribe("serviceRegistry-responseInformation-*"); // handled in registerCurrentApp()

		// register (if not registered already) app after globalData is registered
		Subscriber.on("message", async (channel, message) => {
			if (channel === "globalDataMessage") {
				if (message === "registered") {
					console.log("registered globalDataMessage");

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
		let app = await registerCurrentApp();

		if (process.env.APP_TYPE !== "saas-host") return;
		let websiteInfo: Website | null;

		let { data } = await microserviceCall<Website>({
			name: "websites",
			path: "/api/url/" + process.env["HOST"],
		});
		websiteInfo = data;

		if (websiteInfo === null) {
			let websiteData: CreationAttributes<Website> = {
				active: true,
				testingMode: true,
				paused: false,
				appId: app.id,
				mainLanguageId: app.LanguageId,
			};
			// create a new website and url in websites_ms
			let { data } = await microserviceCall<Website>({
				name: "websites",
				path: "/api/create",
				method: "POST",
				data: {
					website: websiteData,
					url: process.env["APP_HOSTNAME"],
				},
			});
			websiteInfo = data;

			if (!websiteInfo) {
				throw new Error(
					"Could not create new website while creating App."
				);
			}
		}
	} catch (error: any) {
		consoleLogProduction(error, "error", "'appInit' failed.");
	}
});
