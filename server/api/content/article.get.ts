import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { Article } from "~/digitalniweb-types/models/content";

import { getArticleQuery } from "~/digitalniweb-types/apps/communication/modules/articles";
import { resourceIdsType } from "~/digitalniweb-types/apps/communication";

export default eventHandler(async (event): Promise<Article | null | false> => {
	let query = getQuery(event) as getArticleQuery;
	if (!query.resourceIds) return false;
	let resourceIds: resourceIdsType = JSON.parse(query.resourceIds as string);
	query.resourceIds = resourceIds;
	try {
		let { data: article } = await microserviceCall<Article>({
			name: "content",
			id: resourceIds.contentMsId,
			path: "/api/current/modules/article",
			data: query,
		});

		return article;
	} catch (error: unknown) {
		return false;
	}
});
