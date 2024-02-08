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
		return mainWebsiteInfo;
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
