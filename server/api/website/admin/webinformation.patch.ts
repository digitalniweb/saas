import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { log } from "~/digitalniweb-custom/helpers/logger";
import type { WebInformation } from "~/digitalniweb-types/models/content";
import type { InferAttributes } from "sequelize";
import { verifyUser } from "~/custom/helpers/usersAuth";
import type { resourceIdsType } from "~/digitalniweb-types/apps/communication";

export default eventHandler(async (event) => {
	verifyUser(event);
	// let userVerified = event.context.verifiedUser;
	// console.log(userVerified);

	let { data, id, resourceIds } = (await readBody(event)) as {
		data: InferAttributes<WebInformation>;
		id: number;
		resourceIds: resourceIdsType;
	};

	try {
		if (typeof resourceIds === "string")
			resourceIds = JSON.parse(resourceIds) as resourceIdsType;

		if (!resourceIds || !resourceIds.contentMsId || !id) return;

		let { data: success } = await microserviceCall<boolean>({
			method: "PATCH",
			name: "content",
			id: resourceIds.contentMsId,
			path: "/api/current/webinformation",
			data: {
				data,
				id,
			},
		});

		return success;
	} catch (error: any) {
		log({
			type: "routing",
			status: "error",
			message: `Couldn't patch website information.`,
			error,
		});
		return false;
	}
});
