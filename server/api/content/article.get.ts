import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { Article } from "~/digitalniweb-types/models/content";

import { getArticleQuery } from "~/digitalniweb-types/apps/communication/modules/articles";
import { resourceIdsType } from "~/digitalniweb-types/apps/communication";

import { getGlobalDataList } from "~/digitalniweb-custom/helpers/getGlobalData";

export default eventHandler(async (event): Promise<Article | null | false> => {
	let query = getQuery(event) as getArticleQuery;
	if (!query.resourceIds) return false;
	let resourceIds: resourceIdsType = JSON.parse(query.resourceIds as string);
	query.resourceIds = resourceIds;

	if (!query.resourceIds.moduleId) {
		let modules = await getGlobalDataList<"modules">("modules");
		if (!modules) return false;
		let articleModule = modules?.find((m) => m.name === "articles");
		if (!articleModule) return false;
		query.resourceIds.moduleId = articleModule.id;
	}
	try {
		let { data: article } = await microserviceCall<Article>({
			name: "content",
			id: resourceIds.contentMsId,
			path: "/api/current/modules/article",
			params: query,
		});

		return article;
	} catch (error: unknown) {
		return false;
	}
});
