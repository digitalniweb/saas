import { verifyUser } from "~/custom/helpers/usersAuth";
import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import type { resourceIdsType } from "~/digitalniweb-types/apps/communication";
import type {
	getSaveNewArticleRequestBody,
	saveNewArticleRequestBody,
} from "~/digitalniweb-types/apps/communication/modules/articles";
import type { Article } from "~/digitalniweb-types/models/content";
export default eventHandler(async (event) => {
	verifyUser(event);
	let body = (await readBody(event)) as getSaveNewArticleRequestBody;

	let { resourceIds, menu, widgetContent } = body;
	// if (typeof resourceIds === "string")
	// 	resourceIds = JSON.parse(resourceIds) as resourceIdsType;

	// if (typeof menu === "string") menu = JSON.parse(menu);

	// if (typeof menu.newMenuOrders === "string")
	// 	menu.newMenuOrders = JSON.parse(menu.newMenuOrders);

	// // menu.newMenuOrders is array but elements are stringified objects, parse them
	// if (Array.isArray(menu.newMenuOrders)) {
	// 	menu.newMenuOrders = menu.newMenuOrders.map((order) => {
	// 		if (typeof order === "string") {
	// 			return JSON.parse(order);
	// 		}
	// 		return order;
	// 	});
	// }
	if (typeof widgetContent === "string")
		widgetContent = JSON.parse(widgetContent);
	if (typeof menu === "string") menu = JSON.parse(menu);
	if (menu) {
		menu.websiteId = (resourceIds as resourceIdsType).websiteId;
		menu.websitesMsId = (resourceIds as resourceIdsType).websitesMsId;
	}
	try {
		let { data: article } = await microserviceCall<Article>({
			id: (resourceIds as resourceIdsType).contentMsId,
			name: "content",
			method: "PUT",
			path: "/api/current/modules/article/auth/admin/create",
			data: {
				menu,
				widgetContent,
			} as saveNewArticleRequestBody,
		});

		return article;
	} catch (error: unknown) {
		return false;
	}
});
