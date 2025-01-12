import { verifyUser } from "~/custom/helpers/usersAuth";
import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { resourceIdsType } from "~/digitalniweb-types/apps/communication";
import {
	deleteArticleRequestBody,
	getDeleteArticleRequestBody,
} from "~/digitalniweb-types/apps/communication/modules/articles";
import { Article } from "~/digitalniweb-types/models/content";
export default eventHandler(async (event) => {
	verifyUser(event);
	let body = (await readBody(event)) as getDeleteArticleRequestBody;

	let { resourceIds, id, newMenuOrders } = body;
	if (!id) return false;
	if (typeof resourceIds === "string")
		resourceIds = JSON.parse(resourceIds) as resourceIdsType;

	if (typeof newMenuOrders === "string")
		newMenuOrders = JSON.parse(newMenuOrders);

	// newMenuOrders is array but elements are stringified objects, parse them
	if (Array.isArray(newMenuOrders)) {
		newMenuOrders = newMenuOrders.map((order) => {
			if (typeof order === "string") {
				return JSON.parse(order);
			}
			return order;
		});
	}

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
