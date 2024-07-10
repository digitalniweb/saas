import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import AppModule from "~/server/models/apps/appModule.js";
import {
	resourceIdsType,
	useApiCallQuery,
} from "~/digitalniweb-types/apps/communication";

export default eventHandler(async (event) => {
	try {
		let appModules = await AppModule.findAll();
		let query = getQuery(event) as useApiCallQuery;
		let resourceIds: resourceIdsType = JSON.parse(
			query.resourceIds as string
		);
		query.resourceIds = resourceIds;

		let adminMenusGlobalData = await microserviceCall({
			name: "globalData",
			path: "/api/adminmenu/list",
			id: resourceIds.contentMsId,
			data: query,
			cache: false,
		});

		return adminMenusGlobalData.data || [];
	} catch (error) {
		console.log(error);

		return [];
	}
});
