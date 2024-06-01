import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import {
	resourceIdsType,
	useApiCallQuery,
} from "~/digitalniweb-types/apps/communication";

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
			data: query,
			cache: false,
		});

		return data.data || [];
	} catch (error) {
		console.log(error);

		return [];
	}
});
