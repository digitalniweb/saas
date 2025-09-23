import { microserviceCall } from "~~/digitalniweb-custom/helpers/remoteProcedureCall";
import { getQuery } from "h3";

import type { WebInformation } from "~~/digitalniweb-types/models/content";
import type { InferAttributes } from "sequelize";
export default eventHandler(async (event) => {
	let { contentMsId, id }: { contentMsId?: number; id?: number } =
		getQuery(event);
	if (!contentMsId || !id) return;

	let { data: websiteInfoData } = await microserviceCall<
		InferAttributes<WebInformation>
	>({
		name: "content",
		id: contentMsId,
		path: "/api/current/webinformation",
		params: {
			id,
		},
	});

	return websiteInfoData;
});
