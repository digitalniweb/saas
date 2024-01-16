import { InferAttributes } from "sequelize";
import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { Language } from "~/digitalniweb-types/models/globalData";
// import { languages } from "~/digitalniweb-types";

export default eventHandler(async (event) => {
	let { data: websiteLanguagesData } = await microserviceCall<
		InferAttributes<Language>[]
	>({
		name: "websites",
		path: "/api/languages/website/",
		method: "GET",
	});
	let websiteLanguages = websiteLanguagesData;

	// let languages = [] as languages[];
	// websiteLanguages.forEach((lang) => languages.push(lang.code));
	return websiteLanguages;
});
