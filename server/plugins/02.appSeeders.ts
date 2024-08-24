import { log } from "~/digitalniweb-custom/helpers/logger.js";
import AppModule from "../models/apps/appModule";
import { getGlobalDataModelArray } from "~/digitalniweb-custom/helpers/getGlobalData";
export default defineNitroPlugin(async (nitroApp) => {
	try {
		let appModules = await AppModule.findAll();
		if (appModules.length > 0) return;
		AppModule.truncate({ restartIdentity: true }); // reset primary index auto increment
		let moduleNames: string[] = [];
		if (process.env.APP_TYPE === "saas-host") {
			moduleNames = [
				"articles",
				"photoGallery",
				"news",
				"invoices",
				"users",
				"tenants",
			];
			if (process.env.APP_NAME === "webs-host") {
				moduleNames.push("superadmin");
			}
		}
		let modules = await getGlobalDataModelArray(
			"modules",
			"name",
			moduleNames,
			"id"
		);

		if (modules && modules?.length) {
			let modulesCreate = modules.map((moduleId) => {
				return { moduleId: moduleId as number };
			});
			await AppModule.bulkCreate(modulesCreate);
		}
	} catch (error: any) {
		log({
			type: "functions",
			status: "error",
			message: "'appInit' failed.",
			error,
		});
	}
});
