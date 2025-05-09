import type { InferAttributes } from "sequelize";
import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import type { Language } from "~/digitalniweb-types/models/globalData";

export default eventHandler(async (event) => {
	let {
		websitesMsId,
		websiteId,
	}: { websitesMsId?: number; websiteId?: number } = getQuery(event);

	if (!websitesMsId || !websiteId) return false;
	let { data: ids } = await microserviceCall<InferAttributes<Language>[]>({
		name: "websites",
		id: websitesMsId,
		path: "/api/current/languagesIds/",
		params: {
			websiteId,
		},
	});
	return ids;
});
