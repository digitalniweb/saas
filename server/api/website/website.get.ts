import { microserviceCall } from "~~/digitalniweb-custom/helpers/remoteProcedureCall";
import { getQuery } from "h3";

import type { Website } from "~~/digitalniweb-types/models/websites";
import type { InferAttributes } from "sequelize";

export default eventHandler(async (event) => {
	let { url }: { url: string } = getQuery(event);
	let { data: mainWebsiteInfoData } = await microserviceCall<
		InferAttributes<Website>
	>({
		name: "websites",
		path: "/api/url/" + url,
		scope: "all",
	});

	if (!mainWebsiteInfoData) return false;
	return mainWebsiteInfoData;
});
