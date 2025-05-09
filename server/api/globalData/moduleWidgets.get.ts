import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { getQuery } from "h3";

import type { modules } from "~/digitalniweb-types/functionality/modules";

export default eventHandler(async (event): Promise<number[] | null | false> => {
	let { module }: { module: modules } = getQuery(event);
	let { data: widgetsIds } = await microserviceCall<number[]>({
		name: "globalData",
		path: "/api/widgets/modulesids",
		params: { module },
	});

	return widgetsIds;
});
