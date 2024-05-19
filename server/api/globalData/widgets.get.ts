import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { getQuery } from "h3";
import { log } from "~/digitalniweb-custom/helpers/logger";
import { Widget } from "~/digitalniweb-types/models/globalData";

export default eventHandler(async (event): Promise<Widget[] | null | false> => {
	// `ids` is array. But if array has only 1 value then h3 converts it to string
	let { ids } = getQuery(event);
	if (!ids) return false;
	if (typeof ids === "string") ids = [ids];

	try {
		let { data: widgets } = await microserviceCall<Widget[]>({
			name: "globalData",
			path: "/api/widgets/listbyids",
			params: { ids },
			cache: false,
		});

		return widgets;
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
