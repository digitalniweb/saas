import { verifyUser } from "~/custom/helpers/usersAuth";
import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import type { resourceIdsType } from "~/digitalniweb-types/apps/communication";
import type {
	deleteArticleRequestBody,
	getDeleteArticleRequestBody,
} from "~/digitalniweb-types/apps/communication/modules/articles";
import type { Article } from "~/digitalniweb-types/models/content";
export default eventHandler(async (event) => {
	verifyUser(event);
	let body = (await readBody(event)) as getDeleteArticleRequestBody;

	let { resourceIds, id } = body;
	if (!id) return false;
	if (typeof resourceIds === "string")
		resourceIds = JSON.parse(resourceIds) as resourceIdsType;

	try {
		let { data: success } = await microserviceCall<Article>({
			id: resourceIds.contentMsId,
			name: "content",
			method: "DELETE",
			path: "/api/current/modules/article/auth/admin/delete",
			data: {
				id,
			} as deleteArticleRequestBody,
		});

		return success;
	} catch (error: unknown) {
		return false;
	}
});
