import { microserviceCall } from "../../../digitalniweb-custom/helpers/remoteProcedureCall";

export default eventHandler(async (event) => {
	try {
		// console.log("menu", event);
		/* let data = await microserviceCall({
			name: "content",
			path: "/api/test",
			id: event.app.contentMsId
			data: {
				websiteId: 1,
				appId: 1,
			},
		}); */
	} catch (error) {}
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
	];
});
