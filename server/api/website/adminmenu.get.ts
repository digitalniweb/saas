import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import {
	resourceIdsType,
	useApiCallQuery,
} from "~/digitalniweb-types/apps/communication";
import { verifyUser } from "~/custom/helpers/usersAuth";

export default eventHandler(async (event) => {
	try {
		verifyUser(event);
		let query = getQuery(event) as useApiCallQuery;
		let resourceIds: resourceIdsType = JSON.parse(
			query.resourceIds as string
		);
		query.resourceIds = resourceIds;

		query.modules = event.context?.verifiedUser?.UserModulesIds;

		let adminMenusGlobalData = await microserviceCall({
			name: "globalData",
			path: "/api/adminmenu/list",
			id: resourceIds.contentMsId,
			data: query,
			cache: false,
		});

		return adminMenusGlobalData.data || [];
	} catch (error) {
		if (error == "Token expired") {
			setResponseStatus(event, 401, "Token expired");
			return "Token expired";
		}
	}
});
