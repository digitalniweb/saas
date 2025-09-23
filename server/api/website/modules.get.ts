import { microserviceCall } from "~~/digitalniweb-custom/helpers/remoteProcedureCall";
import { getQuery } from "h3";

export default eventHandler(async (event): Promise<number[] | null | false> => {
	let {
		websitesMsId,
		websiteId,
	}: { websitesMsId?: number; websiteId?: number } = getQuery(event);
	if (!websitesMsId || !websiteId) return false;

	let { data: ids } = await microserviceCall<number[]>({
		name: "websites",
		id: websitesMsId,
		path: "/api/current/modulesIds",
		params: {
			websiteId,
		},
	});

	return ids;
});
