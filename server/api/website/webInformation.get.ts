import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { getQuery } from "h3";
import { log } from "~/digitalniweb-custom/helpers/logger";
import { Website } from "~/digitalniweb-types/models/websites";

export default eventHandler(async (event) => {
	let { url }: { url: string } = getQuery(event);
	try {
		let mainWebsiteInfo = (await microserviceCall({
			name: "websites",
			path: "/api/getcurrentwebsite",
			data: {
				url,
			},
			scope: "all",
		})) as Website | null;
		console.log("mainWebsiteInfo", mainWebsiteInfo);

		if (!mainWebsiteInfo) return false;
		let websiteInfo = await microserviceCall({
			name: "content",
			id: mainWebsiteInfo.contentMsId,
			path: "/api/current/webinformation",
			scope: "all",
		});

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
