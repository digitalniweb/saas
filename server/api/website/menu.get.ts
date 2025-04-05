import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import type {
	resourceIdsType,
	useApiCallQuery,
} from "~/digitalniweb-types/apps/communication";
import { log } from "~/digitalniweb-custom/helpers/logger";

export default eventHandler(async (event) => {
	try {
		let query = getQuery(event) as useApiCallQuery;

		let resourceIds: resourceIdsType = JSON.parse(
			query.resourceIds as string
		);
		query.resourceIds = resourceIds;

		let data = await microserviceCall({
			name: "content",
			path: "/api/current/menu",
			id: resourceIds.contentMsId,
			params: query,
		});

		return data.data || [];
	} catch (error: any) {
		log({
			type: "routing",
			status: "error",
			message: `Couldn't get website's menu.`,
			error,
		});
		return [];
	}
});
