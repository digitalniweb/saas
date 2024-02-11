import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { getQuery } from "h3";
import { log } from "~/digitalniweb-custom/helpers/logger";
import { WebInformation } from "~/digitalniweb-types/models/content";
import { InferAttributes } from "sequelize";

export default eventHandler(async (event) => {
	let { contentMsId, id }: { contentMsId?: number; id?: number } =
		getQuery(event);
	try {
		if (!contentMsId || !id) return;

		let { data: websiteInfoData } = await microserviceCall<
			InferAttributes<WebInformation>
		>({
			name: "content",
			id: contentMsId,
			path: "/api/current/webinformation",
			data: {
				id,
			},
		});
		let websiteInfo = websiteInfoData;

		return websiteInfo;
	} catch (error: any) {
		log({
			type: "routing",
			status: "error",
			message: `Couldn't get website information.`,
			error,
		});
		return false;
	}
});
