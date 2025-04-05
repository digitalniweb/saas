import { verifyUser } from "~/custom/helpers/usersAuth";
import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { resourceIdsType } from "~/digitalniweb-types/apps/communication";
import {
	getEditArticleRequestBody,
	editArticleRequestBody,
} from "~/digitalniweb-types/apps/communication/modules/articles";
import type { Article } from "~/digitalniweb-types/models/content";
export default eventHandler(async (event) => {
	verifyUser(event);
	let body = (await readBody(event)) as getEditArticleRequestBody;

	let { resourceIds, menu, widgetContent } = body;
	// if (typeof resourceIds === "string")
	// 	resourceIds = JSON.parse(resourceIds) as resourceIdsType;

	// if (typeof menu !== undefined) {
	// 	if (typeof menu === "string") menu = JSON.parse(menu);

	// 	if (typeof menu?.newMenuOrders === "string")
	// 		menu.newMenuOrders = JSON.parse(menu.newMenuOrders);

	// 	// menu.newMenuOrders is array but elements are stringified objects, parse them
	// 	if (Array.isArray(menu?.newMenuOrders)) {
	// 		menu.newMenuOrders = menu.newMenuOrders.map((order) => {
	// 			if (typeof order === "string") {
	// 				return JSON.parse(order);
	// 			}
	// 			return order;
	// 		});
	// 	}

	// 	if (typeof menu?.newMenuUrls === "string")
	// 		menu.newMenuUrls = JSON.parse(menu.newMenuUrls);

	// 	if (typeof menu?.data === "string") menu.data = JSON.parse(menu.data);
	// 	if (menu?.data) {
	// 		menu.data.websiteId = resourceIds.websiteId;
	// 		menu.data.websitesMsId = resourceIds.websitesMsId;
	// 	}
	// }
	// if (typeof widgetContent === "string")
	// 	widgetContent = JSON.parse(widgetContent);
	if (widgetContent)
		for (const key in widgetContent) {
			if (Object.prototype.hasOwnProperty.call(widgetContent, key)) {
				// @ts-ignore
				const value = widgetContent[key];
				if (Array.isArray(value)) {
					// @ts-ignore
					widgetContent[key] = value.map((order) => {
						if (typeof order === "string") {
							return JSON.parse(order);
						}
						return order;
					});
				}
			}
		}

	try {
		let { data: article } = await microserviceCall<Article>({
			id: (resourceIds as resourceIdsType).contentMsId,
			name: "content",
			method: "PATCH",
			path: "/api/current/modules/article/auth/admin/edit",
			data: {
				menu,
				widgetContent,
			} as editArticleRequestBody,
		});

		return article;
	} catch (error: unknown) {
		return false;
	}
});
