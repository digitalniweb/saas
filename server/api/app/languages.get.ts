import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import AppLanguage from "../../models/apps/appLanguage";
import type { appLanguages } from "~/digitalniweb-types";
import type { Language } from "~/digitalniweb-types/models/globalData";
import { log } from "~/digitalniweb-custom/helpers/logger";
import type { InferAttributes } from "sequelize";

export default eventHandler(async (event): Promise<appLanguages | false> => {
	try {
		let languages = await AppLanguage.findAll();
		let languagesIds: number[] = [];
		languagesIds = languages.map((language) => language.languageId);

		let languagesArray = {} as appLanguages;

		// get app languages from 'globalData'
		let { data: appLanguagesData } = await microserviceCall<
			InferAttributes<Language>[]
		>({
			name: "globalData",
			path: "/api/languages/listbyids",
			params: { ids: languagesIds },
		});
		let appLanguages = appLanguagesData;

		appLanguages?.forEach((language) => {
			languagesArray[language.code] = language;
		});

		return languagesArray;
	} catch (error: any) {
		log({
			type: "routing",
			error,
		});
		return false;
	}
});
