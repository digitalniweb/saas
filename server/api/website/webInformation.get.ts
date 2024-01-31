import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { getQuery } from "h3";
import { log } from "~/digitalniweb-custom/helpers/logger";
import { Website } from "~/digitalniweb-types/models/websites";
import { WebInformation } from "~/digitalniweb-types/models/content";
import { InferAttributes } from "sequelize";

export default eventHandler(async (event) => {
	let { url }: { url: string } = getQuery(event);
	try {
		let { data: mainWebsiteInfoData } = await microserviceCall<
			InferAttributes<Website>
		>({
			name: "websites",
			path: "/api/url/" + url,
			scope: "all",
		});

		// !!! I need to save this info somewhere
		let mainWebsiteInfo = mainWebsiteInfoData;
		console.log("allWebsiteInfo", mainWebsiteInfo);

		if (!mainWebsiteInfo) return false;

		// !!! languageId needs to be current, not 1
		let { data: websiteInfoData } = await microserviceCall<
			InferAttributes<WebInformation>
		>({
			name: "content",
			id: mainWebsiteInfo.contentMsId,
			path: "/api/current/webinformation",
			data: {
				id: mainWebsiteInfo.id,
				languageId: 1,
			},
		});
		let websiteInfo = websiteInfoData;
		console.log("websiteInfo", websiteInfo || "no info");

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
