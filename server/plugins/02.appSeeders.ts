import AppModule from "../models/apps/appModule";
import { getGlobalDataList } from "~/digitalniweb-custom/helpers/getGlobalData";
import AppLanguage from "../models/apps/appLanguage";
import type { languages } from "~/digitalniweb-types";
import AppWidget from "../models/apps/appWidget";
import type { widgets } from "~/digitalniweb-types/functionality/widgets";
import type { modules } from "~/digitalniweb-types/functionality/modules";
import { consoleLogProduction } from "~/digitalniweb-custom/helpers/logger";
import type {
	WebInformation,
	WidgetText,
} from "~/digitalniweb-types/models/content";
import type {
	Article,
	WebInformationLanguage as WebInformationLanguageType,
	ArticleWidget,
} from "~/digitalniweb-types/models/content.js";
import type { InferAttributes, CreationAttributes } from "sequelize";
import type {
	createWebsiteRequest,
	addWebsiteModulesRequest,
} from "~/digitalniweb-types/apps/communication/websites/";
import type { Website } from "~/digitalniweb-types/models/websites";
import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import type { saveNewArticleRequestBody } from "~/digitalniweb-types/apps/communication/modules/articles";
import type { remoteCallResponse } from "~/digitalniweb-types/custom/helpers/remoteProcedureCall";
import type {
	getWebsiteUserByEmailRequest,
	registerAdmin,
} from "~/digitalniweb-types/users";
import type { User } from "~/digitalniweb-types/models/users";
export default defineNitroPlugin(async (nitroApp) => {
	try {
		// app layer
		let appModules = await AppModule.findAll();
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
		let modules = await getGlobalDataList("modules", "name", moduleNames);

		if (appModules.length === 0) {
			AppModule.truncate({ restartIdentity: true }); // reset primary index auto increment

			if (modules && modules?.length) {
				let modulesCreate = modules.map((module) => {
					return { moduleId: module.id as number };
				});
				await AppModule.bulkCreate(modulesCreate);
			}
			appModules = await AppModule.findAll();
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
		let widgetNames: widgets[] = ["text"];
		let widgets = await getGlobalDataList("widgets", "name", widgetNames);
		if (appWidgets.length === 0) {
			AppWidget.truncate({ restartIdentity: true }); // reset primary index auto increment

			if (widgets && widgets?.length) {
				let widgetsCreate = widgets.map((w) => {
					return { widgetId: w.id };
				});
				appWidgets = await AppWidget.bulkCreate(widgetsCreate);
			}
		}

		// ms layer

		// create websiteModules (website_ms) + webinformation (content_ms) + index article + widgetcontents for website (content_ms) + user superadmin
		// seeders in content_ms should be here - make registration out of it
		let websiteUrl = process.env["HOST"];

		let website = await microserviceCall<InferAttributes<Website>>({
			name: "websites",
			scope: "all",
			path: "/api/url/" + websiteUrl,
		});

		if (!website.data) {
			let websiteData = {
				active: true,
				paused: false,
				testingMode: false,
				appId: process.env.APP_ID,
				mainLanguageId: mainLanguage.id,
			} as CreationAttributes<Website>;
			let createWebsiteRequest: createWebsiteRequest = {
				websiteData,
				websiteUrl,
				languages: languageCodes,
				modules: moduleNames,
			};
			website = await microserviceCall<InferAttributes<Website>>({
				name: "websites",
				method: "POST",
				path: "/api/create",
				data: createWebsiteRequest,
			});
		}
		if (!website.headers?.["x-ms-id"])
			throw createError({
				message: "Website didn't provide its microservice id",
				statusCode: 500,
			});

		if (!website.data)
			throw createError({
				message: "Website wasn't created",
				statusCode: 500,
			});

		let websiteModulesIds = website.data?.WebsiteModules?.map(
			(module) => module.id
		);
		let appModulesIds = appModules.map((module) => module.id);

		let moduleDifferenceIds = [
			...new Set(appModulesIds).difference(new Set(websiteModulesIds)),
		];

		if (moduleDifferenceIds?.length) {
			// add missing appModules to website
			let addWebsiteModulesData: addWebsiteModulesRequest = {
				moduleIds: moduleDifferenceIds,
				websiteId: website.data.id,
			};
			await microserviceCall<boolean>({
				name: "websites",
				id: website.headers["x-ms-id"],
				method: "POST",
				path: "/api/addwebsitemodules",
				data: addWebsiteModulesData,
			});
		}
		let superAdminUserRole = "superadmin" as const;
		let superAdminUser: registerAdmin = {
			user: {
				password: "123456",
				email: "admin@digitalniweb.cz",
				websiteId: website.data.id,
				websitesMsId: website.headers["x-ms-id"],
			},
			userRole: superAdminUserRole,
		};

		let adminUser = await microserviceCall<InferAttributes<User>>({
			name: "users",
			method: "GET",
			scope: "all",
			path: "/api/users/getwebsiteuserbyemail",
			params: {
				email: superAdminUser.user.email,
				websiteId: website.data.id,
				websitesMsId: website.headers["x-ms-id"],
			} as getWebsiteUserByEmailRequest,
		});

		if (!adminUser.data) {
			await microserviceCall<boolean>({
				name: "users",
				data: superAdminUser,
				method: "POST",
				path: "/api/users/registeradmin",
			});
		}

		let webinformation = await microserviceCall<
			InferAttributes<WebInformation>
		>({
			name: "content",
			id: website.data.contentMsId,
			method: "GET",
			path: "/api/webinformation/" + website.data.id,
		});

		if (!webinformation.data) {
			let WebInformationLanguages =
				[] as CreationAttributes<WebInformationLanguageType>[];
			let WebInformationLanguagesData = {
				cs: {
					name: "Digitální web",
				},
			} as {
				[key in languages]: CreationAttributes<WebInformationLanguageType>;
			};

			appLanguages?.forEach((language) => {
				let lang = languages?.find(
					(lang) => language.languageId === lang.id
				);
				if (!lang) return;
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
				websitesMsId: website.headers["x-ms-id"],
				zip: "000 01",
				WebInformationLanguages,
			} as CreationAttributes<WebInformation>;
			await microserviceCall<InferAttributes<WebInformation>>({
				name: "content",
				data: webinformation,
				method: "POST",
				path: "/api/webinformation/create",
			});
		}

		let articlesLanguages = [] as saveNewArticleRequestBody[];
		let articlesLanguagesMenus = {
			cs: {
				title: "Vítejte",
				description: "Tohle je Vaše nová webová stránka",
				name: "Domů",
				url: "/",
				websiteId: website.data.id,
				websitesMsId: website.headers["x-ms-id"],
				active: true,
			},
		} as {
			[key in languages]: CreationAttributes<Article>;
		};

		let articlesLanguagesContents = {
			cs: {
				widgetId: widgets?.find((w) => w.name === "text")?.id,
				WidgetText: {
					name: "Vítejte",
					content:
						"<p>Tohle je Vaše nová webová stránka</p><p>Přejděte do <a href='/admin/'>administace webu</a> a upravte stránky</p>",
					moduleId: modules?.find((a) => a.name === "articles")?.id,
				} as CreationAttributes<WidgetText>,
			},
		} as {
			[key in languages]: CreationAttributes<ArticleWidget>;
		};

		appLanguages?.forEach((language) => {
			let lang = languages?.find(
				(lang) => language.languageId === lang.id
			);
			if (!lang || !articlesLanguagesMenus[lang.code]) return;
			articlesLanguagesMenus[lang.code].languageId = lang.id;
			let articleLang = {
				menu: articlesLanguagesMenus[lang.code],
				widgets: {
					new: [articlesLanguagesContents[lang.code]],
				},
			} as saveNewArticleRequestBody;

			articlesLanguages.push(articleLang);
		});

		if (articlesLanguages.length) {
			let createArticles = [] as Promise<remoteCallResponse<Article>>[];
			articlesLanguages.forEach((article) => {
				createArticles.push(
					microserviceCall({
						id: website.data!.contentMsId,
						name: "content",
						method: "PUT",
						path: "/api/articles/create",
						data: article,
					})
				);
			});
			await Promise.all([...createArticles]);
		}
	} catch (error: any) {
		consoleLogProduction(error, "error", "App seeder failed.");
	}
});
