import { log } from "~/digitalniweb-custom/helpers/logger.js";
import AppModule from "../models/apps/appModule";
import { getGlobalDataModelArray } from "~/digitalniweb-custom/helpers/getGlobalData";
import AppLanguage from "../models/apps/appLanguage";
import { languages } from "~/digitalniweb-types";
import AppWidget from "../models/apps/appWidget";
import { widgets } from "~/digitalniweb-types/functionality/widgets";
import { modules } from "~/digitalniweb-types/functionality/modules";
export default defineNitroPlugin(async (nitroApp) => {
	try {
		let appModules = await AppModule.findAll();
		if (appModules.length === 0) {
			AppModule.truncate({ restartIdentity: true }); // reset primary index auto increment
			let moduleNames: modules[] = [];
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
			} else if (process.env.APP_TYPE === "saas-tenants") {
				moduleNames = ["articles", "photoGallery", "news"];
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
		}

		let appLanguages = await AppLanguage.findAll();
		if (appLanguages.length === 0) {
			AppLanguage.truncate({ restartIdentity: true }); // reset primary index auto increment
			let languageCodes = process.env.APP_LANGUAGES.split(
				","
			) as languages[];
			if (!languageCodes.includes(process.env.DEFAULT_LANGUAGE))
				languageCodes.unshift(process.env.DEFAULT_LANGUAGE);

			let languages = await getGlobalDataModelArray(
				"languages",
				"code",
				languageCodes,
				"id"
			);
			if (languages && languages?.length) {
				let languagesCreate = languages.map((languageId) => {
					return { languageId: languageId as number };
				});
				await AppLanguage.bulkCreate(languagesCreate);
			}
		}

		let appWidgets = await AppWidget.findAll();
		if (appWidgets.length === 0) {
			AppWidget.truncate({ restartIdentity: true }); // reset primary index auto increment
			let widgetNames: widgets[] = ["text"];

			let widgets = await getGlobalDataModelArray(
				"widgets",
				"name",
				widgetNames,
				"id"
			);

			if (widgets && widgets?.length) {
				let widgetsCreate = widgets.map((widgetId) => {
					return { widgetId: widgetId as number };
				});
				await AppWidget.bulkCreate(widgetsCreate);
			}
		}
	} catch (error: any) {
		log({
			type: "functions",
			status: "error",
			message: "App seeder failed.",
			error,
		});
	}
});
