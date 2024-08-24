import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import {
	resourceIdsType,
	useApiCallQuery,
} from "~/digitalniweb-types/apps/communication";
import { verifyUser } from "~/custom/helpers/usersAuth";
import { log } from "~/digitalniweb-custom/helpers/logger";

export default eventHandler(async (event) => {
	verifyUser(event);
	let userVerified = event.context.verifiedUser;

	let query = getQuery(event) as useApiCallQuery;
	let resourceIds: resourceIdsType = JSON.parse(query.resourceIds as string);
	query.resourceIds = resourceIds;

	query.roleName = userVerified.role.name;

	if (["admin", "owner"].includes(userVerified.role.name))
		query.modules = userVerified.UserModulesIds as [];

	try {
		let adminMenusGlobalData = await microserviceCall({
			name: "globalData",
			path: "/api/adminmenu/list",
			id: resourceIds.contentMsId,
			data: query,
			cache: false,
		});

		return adminMenusGlobalData.data || [];
	} catch (error: any) {
		log({
			type: "routing",
			status: "error",
			message: `Couldn't get adminmenu list.`,
			error,
		});
		return false;
	}
});
