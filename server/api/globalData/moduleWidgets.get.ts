import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { getQuery } from "h3";
import { log } from "~/digitalniweb-custom/helpers/logger";
import { modules } from "~/digitalniweb-types/functionality/modules";

export default eventHandler(async (event): Promise<number[] | null | false> => {
	let { module }: { module: modules } = getQuery(event);
	try {
		let { data: widgetsIds } = await microserviceCall<number[]>({
			name: "globalData",
			path: "/api/widgets/modulesids",
			params: { module },
		});

		return widgetsIds;
	} catch (error: any) {
		log({
			type: "routing",
			status: "error",
			message: `Couldn't get globalData widgets by ids.`,
			error,
		});
		return false;
	}
});
