import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { getQuery } from "h3";
import { log } from "~/digitalniweb-custom/helpers/logger";

export default eventHandler(async (event) => {
	let { websitesMsId, id }: { websitesMsId?: number; id?: number } =
		getQuery(event);
	try {
		if (!websitesMsId || !id) return;

		let { data: ids } = await microserviceCall<number[]>({
			name: "websites",
			id: websitesMsId,
			path: "/api/current/modulesIds",
			data: {
				id,
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
