import { microserviceCall } from "~~/digitalniweb-custom/helpers/remoteProcedureCall";
import { getQuery } from "h3";

import type { Module } from "~~/digitalniweb-types/models/globalData";

export default eventHandler(async (event): Promise<Module[] | null | false> => {
	// `ids` is array. But if array has only 1 value then h3 converts it to string
	let { ids } = getQuery(event);
	if (!ids) return false;
	if (typeof ids === "string") ids = [ids];

	let { data: modules } = await microserviceCall<Module[]>({
		name: "globalData",
		path: "/api/modules/listbyids",
		params: { ids },
	});

	return modules;
});
