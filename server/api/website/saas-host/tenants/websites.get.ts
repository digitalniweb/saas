import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { getQuery } from "h3";
import { log } from "~/digitalniweb-custom/helpers/logger";
import { Website } from "~/digitalniweb-types/models/websites";
import { InferAttributes } from "sequelize";
import { verifyUser } from "~/custom/helpers/usersAuth";
import {
	resourceIdsType,
	useApiCallQuery,
} from "~/digitalniweb-types/apps/communication";

export default eventHandler(async (event) => {
	verifyUser(event);
	let userVerified = event.context.verifiedUser;
	if (!["user", "tenant"].includes(userVerified.role.name)) return false;
	try {
		let query = getQuery(event) as useApiCallQuery;
		let resourceIds: resourceIdsType = JSON.parse(
			query.resourceIds as string
		);
		query.resourceIds = resourceIds;

		let { data: mainWebsiteInfoData } = await microserviceCall<
			InferAttributes<Website>
		>({
			name: "websites",
			id: resourceIds.websitesMsId,
			path: "/api/saas-host/tenants-websites/" + userVerified.id,
		});

		if (!mainWebsiteInfoData) return false;
		return mainWebsiteInfoData;
	} catch (error: any) {
		log({
			type: "routing",
			status: "error",
			message: `Couldn't get tenant's with user id ${event.context?.verifiedUser?.id} websites list.`,
			error,
		});
		return false;
	}
});
