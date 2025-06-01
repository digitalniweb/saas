import AppModule from "../models/apps/appModule";
import {
	getGlobalDataList,
	getGlobalDataModelArray,
} from "~/digitalniweb-custom/helpers/getGlobalData";
import AppLanguage from "../models/apps/appLanguage";
import type { languages } from "~/digitalniweb-types";
import AppWidget from "../models/apps/appWidget";
import type { widgets } from "~/digitalniweb-types/functionality/widgets";
import type { modules } from "~/digitalniweb-types/functionality/modules";
import { consoleLogProduction } from "~/digitalniweb-custom/helpers/logger";
import type { WebInformation } from "~/digitalniweb-types/models/content";
import type {
	Article,
	WebInformationLanguage as WebInformationLanguageType,
	WidgetContent,
} from "~/digitalniweb-types/models/content.js";
import type { InferAttributes, CreationAttributes } from "sequelize";
import type { createWebsiteRequest } from "~/digitalniweb-types/apps/communication/websites/";
import type { Website } from "~/digitalniweb-types/models/websites";
import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
export default defineNitroPlugin(async (nitroApp) => {
	try {
		// app layer
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
					"saasHost",
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
		let languageCodes = process.env.APP_LANGUAGES.split(",") as languages[];
		let languages = await getGlobalDataList("languages");
		let mainLanguage = languages?.find(
			(lang) => lang.code === process.env.DEFAULT_LANGUAGE
		);
		if (!mainLanguage)
			throw createError({
				message: "Main language wasn't found",
				statusCode: 500,
			});
		if (appLanguages.length === 0) {
			AppLanguage.truncate({ restartIdentity: true }); // reset primary index auto increment
			if (languages && languages?.length) {
				let languagesCreate = languages.map((language) => {
					return { languageId: language.id };
				});
				appLanguages = await AppLanguage.bulkCreate(languagesCreate);
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

		// ms layer

		// create websiteModules (website_ms) + webinformation (content_ms) + index article + widgetcontents for website (content_ms)
		// seeders in content_ms should be here - make registration out of it
		let websiteUrl = "digitalniwebapp.local";

		let website = await microserviceCall<InferAttributes<Website>>({
			name: "websites",
			scope: "all",
			path: "/api/url/" + websiteUrl,
		});
		if (!website) {
			let websiteData = {
				active: true,
				paused: false,
				testingMode: false,
				appId: process.env.APP_ID,
				mainLanguageId: mainLanguage.id,
			} as CreationAttributes<Website>;
			let createWebsiteRequest = {
				websiteData,
				websiteUrl,
				languages: languageCodes,
			} as createWebsiteRequest;
			website = await microserviceCall<InferAttributes<Website>>({
				name: "websites",
				method: "POST",
				path: "/api/create",
				data: createWebsiteRequest,
			});
		}
		if (!website.data)
			throw createError({
				message: "Website wasn't created",
				statusCode: 500,
			});

		let webinformation = await microserviceCall<
			InferAttributes<WebInformation>
		>({
			name: "content",
			id: website.data.contentMsId,
			method: "GET",
			path: "/api/webinformation/" + website.data.id,
		});
		if (!webinformation) {
			let WebInformationLanguages =
				[] as CreationAttributes<WebInformationLanguageType>[];
			let WebInformationLanguagesData = {
				cs: {
					name: "Digitální web",
				},
			} as {
				[key in languages]: CreationAttributes<WebInformationLanguageType>;
			};
			languages?.forEach((lang) => {
				let WebInformationLanguage: CreationAttributes<WebInformationLanguageType> =
					{
						languageId: lang.id,
					};
				if (WebInformationLanguagesData[lang.code])
					WebInformationLanguage = {
						...WebInformationLanguage,
						...WebInformationLanguagesData[lang.code],
					};
				WebInformationLanguages.push(WebInformationLanguage);
			});
			let webinformation = {
				name: "Digital web",
				city: "Praha",
				country: "Czech republic",
				email: "digitalniweb@gmail.cz",
				streetAddress: "Yemen street",
				houseNumber: "1",
				addressPattern: "STREET, COUNTRY",
				fullAddress: "Yemen street, Yemen",
				googleTagManagerActive: false,
				owner: "Digitální web",
				telephone: "+420 777 111 111",
				websiteId: website.data.id,
				websitesMsId: website.headers?.["x-ms-id"],
				zip: "000 01",
				WebInformationLanguages,
			} as CreationAttributes<WebInformation>;
			await microserviceCall<InferAttributes<WebInformation>>({
				name: "content",
				data: webinformation,
				method: "POST",
				path: "/api/webinformation/",
			});
		}
		let indexArticleCzech = {
			// languageId: 1,
			title: "Vítejte",
			description: "Tohle je Vaše nová webová stránka",
			name: "Domů",
			url: "/",
			websiteId: website.data.id,
			websitesMsId: website.headers?.["x-ms-id"],
		} as CreationAttributes<Article>;
		let indexArticleContentCzech = {
			content:
				"<p>Tohle je Vaše nová webová stránka</p><p>Přejděte do <a href='/admin/'>administace webu</a> a upravte stránky</p>",
			// moduleId: 1,
			// moduleRecordId: 1,
			name: "Vítejte",
			// widgetId: 1,
		} as CreationAttributes<WidgetContent>;
	} catch (error: any) {
		consoleLogProduction(error, "error", "App seeder failed.");
	}
});
