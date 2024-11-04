import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import {
	resourceIdsType,
	useApiCallQuery,
} from "~/digitalniweb-types/apps/communication";
import { log } from "~/digitalniweb-custom/helpers/logger";
import { verifyUser } from "~/custom/helpers/usersAuth";

export default eventHandler(async (event) => {
	verifyUser(event);
	try {
		let query = getQuery(event) as useApiCallQuery;

		let resourceIds: resourceIdsType = JSON.parse(
			query.resourceIds as string
		);
		query.resourceIds = resourceIds;

		let data = await microserviceCall({
			name: "content",
			path: "/api/current/menu/all",
			id: resourceIds.contentMsId,
			params: query,
		});

		return data.data || [];
	} catch (error: any) {
		log({
			type: "routing",
			status: "error",
			message: `Couldn't get website's menu for admin.`,
			error,
		});
		return [];
	}
});
