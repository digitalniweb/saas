import { useCurrentPageStore } from "../store/currentPage";
import type { translations } from "~/digitalniweb-types/translations";
import { defaultTranslations } from "~/digitalniweb-custom/variables/translations";

export function useTranslations(translations?: translations) {
	const currentPage = useCurrentPageStore();
	let langCode = currentPage.language?.code || "en";
	const translate = (property: string) => {
		return (
			translations?.[property]?.[langCode] ??
			translations?.[property]?.en ??
			defaultTranslations?.[property]?.[langCode] ??
			defaultTranslations?.[property]?.en ??
			property
		);
	};
	return { translate };
}
