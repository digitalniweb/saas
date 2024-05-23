import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import {
	resourceIdsType,
	useApiCallQuery,
} from "~/digitalniweb-types/apps/communication";

export default eventHandler(async (event) => {
	try {
		let query = getQuery(event) as useApiCallQuery;
		let resourceIds: resourceIdsType = JSON.parse(
			query.resourceIds as string
		);
		query.resourceIds = resourceIds;

		let data = await microserviceCall({
			name: "content",
			path: "/api/current/menu",
			id: resourceIds.contentMsId,
			data: query,
			cache: false,
		});

		return data.data || [];
	} catch (error) {
		console.log(error);

		return [
			{
				url: "/",
				name: "home",
			},
			{
				url: "/submenus",
				name: "submenus",
				children: [
					{
						name: "user",
						url: "/user",
						children: [
							{
								name: "test",
								url: "/test",
							},
						],
					},
					{
						name: "submenu nested",
						url: "/nested",
						children: [
							{
								name: "nested",
								url: "/nested-2",
							},
						],
					},
				],
			},
			{
				url: "/login",
				name: "login",
			},
			{
				url: "/admin",
				name: "admin",
			},
		];
	}
});
