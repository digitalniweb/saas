import { microserviceCall } from "~~/digitalniweb-custom/helpers/remoteProcedureCall";
import type {
	resourceIdsType,
	useApiCallQuery,
} from "~~/digitalniweb-types/apps/communication";
import { verifyUser } from "~~/custom/helpers/usersAuth";

export default eventHandler(async (event) => {
	verifyUser(event);
	let userVerified = event.context.verifiedUser;

	let query = getQuery(event) as useApiCallQuery;
	let resourceIds: resourceIdsType = JSON.parse(query.resourceIds as string);
	query.resourceIds = resourceIds;

	query.roleName = userVerified.role.name;

	if (["admin", "owner"].includes(userVerified.role.name))
		query.modules = userVerified.UserModulesIds as [];

	let adminMenusGlobalData = await microserviceCall({
		name: "globalData",
		path: "/api/adminmenu/list",
		id: resourceIds.contentMsId,
		params: query,
	});

	return adminMenusGlobalData.data || [];
});
