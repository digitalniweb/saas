import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { Language } from "~/digitalniweb-types/models/globalData";
import { languages } from "~/digitalniweb-types";

export default eventHandler(async (event) => {
	let websiteLanguages = (await microserviceCall({
		name: "websites",
		path: "/api/languages/website/",
		method: "GET",
	})) as Language[];

	let languages = [] as languages[];
	websiteLanguages.forEach((lang) => languages.push(lang.code));
	return websiteLanguages;
});
