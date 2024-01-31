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
			path: "/api/website/url/:" + url,
			scope: "all",
		});
		let mainWebsiteInfo = mainWebsiteInfoData;
		console.log("mainWebsiteInfo", mainWebsiteInfo);

		if (!mainWebsiteInfo) return false;
		let { data: websiteInfoData } = await microserviceCall<
			InferAttributes<WebInformation>
		>({
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
