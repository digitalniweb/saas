import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { Article } from "~/digitalniweb-types/models/content";

import { getArticleQuery } from "~/digitalniweb-types/apps/communication/modules/articles";
import { resourceIdsType } from "~/digitalniweb-types/apps/communication";

export default eventHandler(async (event): Promise<Article | null | false> => {
	let query = getQuery(event) as getArticleQuery;
	if (!query.resourceIds) return false;

	try {
		let { data: article } = await microserviceCall<Article>({
			name: "content",
			id: (query.resourceIds as resourceIdsType).contentMsId,
			path: "/api/current/modules/article",
			data: query,
			cache: false,
		});

		return article;
	} catch (error: unknown) {
		return false;
	}
});
