import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { getQuery } from "h3";
import { log } from "~/digitalniweb-custom/helpers/logger";
import { Website } from "~/digitalniweb-types/models/websites";
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

		if (!mainWebsiteInfoData) return false;
		return mainWebsiteInfoData;
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
