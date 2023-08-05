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
			url: "/",
			name: "submenus",
			children: [
				{
					name: "submenu",
					url: "/",
					children: [
						{
							name: "test",
							url: "/",
						},
					],
				},
				{
					name: "submenu nested",
					url: "/",
					children: [
						{
							name: "nested",
							url: "/",
						},
					],
				},
			],
		},
	];
});
