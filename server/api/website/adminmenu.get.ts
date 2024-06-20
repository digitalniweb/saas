import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import AppAdminMenu from "~/server/models/apps/appAdminMenu";
import {
	resourceIdsType,
	useApiCallQuery,
} from "~/digitalniweb-types/apps/communication";

export default eventHandler(async (event) => {
	try {
		let adminMenus = AppAdminMenu.findAll();
		let query = getQuery(event) as useApiCallQuery;
		let resourceIds: resourceIdsType = JSON.parse(
			query.resourceIds as string
		);
		query.resourceIds = resourceIds;

		let data = await microserviceCall({
			name: "globalData",
			path: "/api/adminmenu/list",
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
