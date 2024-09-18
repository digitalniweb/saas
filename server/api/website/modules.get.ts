import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { getQuery } from "h3";
import { log } from "~/digitalniweb-custom/helpers/logger";

export default eventHandler(async (event): Promise<number[] | null | false> => {
	let {
		websitesMsId,
		websiteId,
	}: { websitesMsId?: number; websiteId?: number } = getQuery(event);
	try {
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
