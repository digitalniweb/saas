import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { getQuery } from "h3";

import type { Website } from "~/digitalniweb-types/models/websites";
import type { InferAttributes } from "sequelize";
import { verifyUser } from "~/custom/helpers/usersAuth";
import type {
	resourceIdsType,
	useApiCallQuery,
} from "~/digitalniweb-types/apps/communication";

export default eventHandler(async (event) => {
	verifyUser(event);
	let userVerified = event.context.verifiedUser;
	if (!["user", "tenant"].includes(userVerified.role.name)) return false;
	let query = getQuery(event) as useApiCallQuery;
	let resourceIds: resourceIdsType = JSON.parse(query.resourceIds as string);
	query.resourceIds = resourceIds;

	let { data: mainWebsiteInfoData } = await microserviceCall<
		InferAttributes<Website>
	>({
		name: "websites",
		id: resourceIds.websitesMsId,
		path: "/api/tenantwebsites/" + userVerified.id,
	});

	if (!mainWebsiteInfoData) return false;
	return mainWebsiteInfoData;
});
