import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { Article } from "~/digitalniweb-types/models/content";

import { resourceIds } from "~/digitalniweb-types/apps/communication";

export default eventHandler(async (event): Promise<Article | null | false> => {
	let query = getQuery(event) as typeof getQuery & {
		resourceIds: resourceIds;
		url: string;
	};
	if (!query.resourceIds) return false;

	try {
		let { data: article } = await microserviceCall<Article>({
			name: "content",
			id: query.resourceIds.contentMsId,
			path: "/api/current/modules/article?url=" + query.url,
			data: query,
			cache: false,
		});

		return article;
	} catch (error: unknown) {
		return false;
	}
});
