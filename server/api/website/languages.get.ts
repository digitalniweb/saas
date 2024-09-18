import { InferAttributes } from "sequelize";
import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { Language } from "~/digitalniweb-types/models/globalData";
// import { languages } from "~/digitalniweb-types";
import { log } from "~/digitalniweb-custom/helpers/logger";

export default eventHandler(async (event) => {
	let {
		websitesMsId,
		websiteId,
	}: { websitesMsId?: number; websiteId?: number } = getQuery(event);
	try {
		if (!websitesMsId || !websiteId) return false;
		let { data: ids } = await microserviceCall<InferAttributes<Language>[]>(
			{
				name: "websites",
				id: websitesMsId,
				path: "/api/current/languagesIds/",
				params: {
					websiteId,
				},
			}
		);
		return ids;
	} catch (error: any) {
		log({
			type: "routing",
			status: "error",
			message: `Couldn't get website's modules ids.`,
			error,
		});
		return false;
	}
});
