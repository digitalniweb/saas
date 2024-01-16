import Subscriber from "../../digitalniweb-custom/helpers/subscriberService.js";
import {
	requestServiceRegistryInfo,
	registerCurrentApp,
} from "../../digitalniweb-custom/helpers/serviceRegistryCache.js";
import { Website } from "~/digitalniweb-types/models/websites.js";
import { CreationAttributes } from "sequelize";
import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall.js";
import { customLogObject } from "~/digitalniweb-types/customHelpers/logger.js";
import { log } from "~/digitalniweb-custom/helpers/logger.js";
export default defineNitroPlugin(async (nitroApp) => {
	try {
		await Subscriber.psubscribe("serviceRegistry-responseInformation-*"); // handled in registerCurrentApp()
		let serviceRegistryInfo = await requestServiceRegistryInfo();
		if (!serviceRegistryInfo)
			throw new Error("Couldn't get serviceRegistry information.");
		let app = await registerCurrentApp();

		if (process.env.APP_TYPE !== "saas-host") return;
		let websiteInfo: Website | null;
		try {
			let { data } = await microserviceCall<Website>({
				name: "websites",
				path: "/api/getwebsiteinfo",
				data: {
					url: process.env["HOST"],
				},
			});
			websiteInfo = data;
		} catch (error) {
			throw {
				type: "database",
				status: "error",
				error: `Error while getting Website ${process.env["HOST"]}`,
			} as customLogObject;
		}

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
				path: "/api/createwebsite",
				method: "POST",
				data: {
					website: websiteData,
					url: process.env["APP_HOSTNAME"],
				},
			});
			websiteInfo = data;

			if (!websiteInfo) {
				throw {
					type: "database",
					status: "error",
					error: "Could not create new website while creating App.",
				} as customLogObject;
			}
		}
	} catch (error: any) {
		log({
			type: "functions",
			status: "error",
			message: "'appInit' failed.",
			error,
		});
	}
});
