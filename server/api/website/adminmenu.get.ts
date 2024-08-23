import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import {
	resourceIdsType,
	useApiCallQuery,
} from "~/digitalniweb-types/apps/communication";
import { verifyUser } from "~/custom/helpers/usersAuth";
import { log } from "~/digitalniweb-custom/helpers/logger";

export default eventHandler(async (event) => {
	let verify = verifyUser(event);
	if (typeof verify === "string") return verify;

	let query = getQuery(event) as useApiCallQuery;
	let resourceIds: resourceIdsType = JSON.parse(query.resourceIds as string);
	query.resourceIds = resourceIds;

	query.roleName = verify.role.name;

	if (["admin", "owner"].includes(verify.role.name))
		query.modules = verify.UserModulesIds as [];

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
