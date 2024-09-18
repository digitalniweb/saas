import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { log } from "~/digitalniweb-custom/helpers/logger";
import { WebInformation } from "~/digitalniweb-types/models/content";
import { InferAttributes } from "sequelize";
import { verifyUser } from "~/custom/helpers/usersAuth";

export default eventHandler(async (event) => {
	verifyUser(event);
	let userVerified = event.context.verifiedUser;
	console.log(userVerified);

	let { data, websiteId, websitesMsId } = (await readBody(event)) as {
		data: InferAttributes<WebInformation>;
		websiteId: number;
		websitesMsId: number;
	};
	try {
		if (!websiteId || !websitesMsId) return;

		let { data: success } = await microserviceCall<boolean>({
			method: "PATCH",
			name: "content",
			id: websitesMsId,
			path: "/api/current/webinformation",
			data: {
				data,
				websiteId,
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
