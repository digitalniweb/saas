import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { Article } from "~/digitalniweb-types/models/content";

export default eventHandler(async (event): Promise<Article | null | false> => {
	let query = getQuery(event);
	let websiteId = parseInt(getHeader(event, "x-website-id") ?? "");
	let websitesMsId = parseInt(getHeader(event, "x-websites-ms-id") ?? "");
	if (isNaN(websitesMsId) || isNaN(websiteId)) return false;

	let { data: article } = await microserviceCall<Article>({
		name: "websites",
		id: websitesMsId,
		path: "/api/current/modules/article?id=" + websiteId,
		data: query,
		cache: false,
	});

	return article;
});
