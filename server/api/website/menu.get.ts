export default eventHandler(async (event) => {
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
