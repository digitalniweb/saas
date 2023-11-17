import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { getQuery } from "h3";
import { log } from "~/digitalniweb-custom/helpers/logger";
import appCache from "~/digitalniweb-custom/helpers/appCache";

export default eventHandler(async (event) => {
	let { url }: { url: string } = getQuery(event);
	try {
		let websiteInfo = microserviceCall({
			name: "content",
			path: "/api/current/webinformation",
		});
		let mainWebsiteInfo = microserviceCall({
			name: "websites",
			id: process.env.APP_CONTENT_MS_ID,
			path: "/api/getcurrentwebsite",
			data: {
				url,
			},
		});
		console.log(
			"serviceRegistry",
			appCache.get("serviceRegistry").websites.services
		);

		// for the mainWebsiteInfo I should use something like this
		// function firstNonNullPromise(promises) {
		// 	return new Promise((resolve, reject) => {
		// 		let resolvedCount = 0;
		// 		promises = promises.map(p => Promise.resolve(p));
		// 		promises.forEach(p =>
		// 			p.then(val => {
		// 				resolvedCount++;
		// 				if (val !== null) {
		// 					resolve(val);
		// 				} else if (resolvedCount === promises.length) {
		// 					reject('All promises resolved to null');
		// 				}
		// 			}).catch(reject)
		// 		);
		// 	});
		// }

		let allWebsiteInfo = await Promise.all([websiteInfo, mainWebsiteInfo]);
		console.log(allWebsiteInfo);

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
	} catch (error: any) {
		log({
			type: "routing",
			status: "error",
			message: `Couldn't get website ${url} information.`,
			error,
		});
		return false;
	}
});
