import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";

export default eventHandler(async (event) => {
	let data = await microserviceCall({
		name: "websites",
		path: "/api/getcurrentwebsite",
	});

	return {
		all: {},
		en: {
			name: "Digital web",
			title: "Build Your Own Website with Digitalweb.com",
			description:
				"Digitalweb.com is a cloud-based website builder that lets you create stunning websites in minutes. Whether you need a personal blog, a business site, or an online store, Digitalweb has everything you need. Choose from templates or start from scratch. Drag and drop elements, add images, videos, text, and more. Customize your design and make it your own. No coding skills required. Get started today and create your own website with Digitalweb.com.",
			www: "digitalweb.com",
		},
	};
});
