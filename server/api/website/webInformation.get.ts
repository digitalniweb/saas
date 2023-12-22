import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { getQuery } from "h3";
import { log } from "~/digitalniweb-custom/helpers/logger";
import { Website } from "~/digitalniweb-types/models/websites";
import { WebInformation } from "~/digitalniweb-types/models/content";

export default eventHandler(async (event) => {
	let { url }: { url: string } = getQuery(event);
	try {
		let { data: mainWebsiteInfoData }: { data: Website } =
			await microserviceCall({
				name: "websites",
				path: "/api/getcurrentwebsite",
				data: {
					url,
				},
				scope: "all",
			});
		let mainWebsiteInfo = mainWebsiteInfoData;
		console.log("mainWebsiteInfo", mainWebsiteInfo);

		if (!mainWebsiteInfo) return false;
		let { data: websiteInfoData }: { data: WebInformation } =
			await microserviceCall({
				name: "content",
				id: mainWebsiteInfo.contentMsId,
				path: "/api/current/webinformation",
				scope: "all",
			});
		let websiteInfo = websiteInfoData;
		console.log("mainWebsiteInfo", mainWebsiteInfo);
		console.log("allWebsiteInfo", websiteInfo);

		return {
			all: {},
			en: {
				name: "",
				title: "",
				description: "",
				www: "",
			},
		};
	} catch (error: any) {
		log({
			type: "routing",
			status: "error",
			message: `Couldn't get website ${url} information.`,
			error,
		});
		return false;
	}
});
