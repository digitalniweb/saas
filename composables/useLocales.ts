import { useCurrentPageStore } from "../store/currentPage";
import { useModulesStore } from "../store/modules";
import { useWebInformationStore } from "../store/webInformation";
import type { modules } from "../digitalniweb-types/functionality/modules";

import type { InferAttributes } from "sequelize";

import type { ModulePageLanguage } from "../digitalniweb-types/models/globalData";
import type {
	WebInformation,
	WebInformationLanguage,
} from "../digitalniweb-types/models/content";

export const useLocales = () => {
	const currentPage = useCurrentPageStore();
	const modules = useModulesStore();
	const webInformation = useWebInformationStore();

	const webinformationLocale = (
		param:
			| keyof InferAttributes<WebInformation>
			| keyof InferAttributes<WebInformationLanguage>
	) => {
		let value: any;
		let webInformationLanguage =
			webInformation.data?.WebInformationLanguages?.find(
				(wl) => wl.languageId === currentPage.language?.id
			);
		if (webInformationLanguage && param in webInformationLanguage)
			value =
				webInformationLanguage[
					param as keyof InferAttributes<WebInformationLanguage>
				];
		else if (webInformationLanguage && param in webInformation)
			value =
				webInformation.data[
					param as keyof InferAttributes<WebInformation>
				];

		// default values
		if (!value) {
			if (param == "mainImage")
				value = "/img/digitalniweb-main-image.webp";
			else if (param == "logo") value = "/img/logo.webp";
		}
		return value ?? "";
	};
	const modulesLocale = (
		module: modules,
		modulePage: string,
		column: keyof InferAttributes<ModulePageLanguage>
	) => {
		let currModule = modules.globalData.find((m) => m.name === module);
		let currModulePage = currModule?.ModulePages?.find(
			(mp) => mp.name === modulePage
		);
		let currModulePageLanguage = currModulePage?.ModulePageLanguages?.find(
			(mpl) => mpl.LanguageId === currentPage.language?.id
		);
		let returnValue = currModulePageLanguage?.[column];
		if (column === "url" && !returnValue?.startsWith("/"))
			returnValue = "/" + returnValue;
		return returnValue;
	};
	return {
		webinformationLocale,
		modulesLocale,
	};
};
