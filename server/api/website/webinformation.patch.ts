import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { log } from "~/digitalniweb-custom/helpers/logger";
import { WebInformation } from "~/digitalniweb-types/models/content";
import { InferAttributes } from "sequelize";

export default eventHandler(async (event) => {
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
