import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import type {
	resourceIdsType,
	useApiCallQuery,
} from "~/digitalniweb-types/apps/communication";

export default eventHandler(async (event) => {
	let query = getQuery(event) as useApiCallQuery;

	let resourceIds: resourceIdsType = JSON.parse(query.resourceIds as string);
	query.resourceIds = resourceIds;

	let data = await microserviceCall({
		name: "content",
		path: "/api/current/menu",
		id: resourceIds.contentMsId,
		params: query,
	});

	return data.data || [];
});
