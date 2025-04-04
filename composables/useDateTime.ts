import { languages } from "~/digitalniweb-types";
import { useCurrentPageStore } from "~/store/currentPage";
import { isISO8601, isDate } from "validator";
import { dateType } from "~/digitalniweb-types/date";
const currentPage = useCurrentPageStore();
const { translate } = useTranslations();
export const useDateTime = () => {
	const prettyDateTime = (date: dateType, locale?: languages): string => {
		// isDate(date) accepts "Date" type but typescript throws error for some reason. So cast it to "string" and it works in this case; isDate(date as unknown as string)
		if (date === undefined) return translate("Invalid date");
		else if (date === null) return translate("Invalid date");
		else if (
			!isDate(date as unknown as string) &&
			!isISO8601(date as string)
		)
			return translate("Invalid date");
		const newDate = new Date(date);
		let langCode = locale || currentPage.language?.code || "en";
		return new Intl.DateTimeFormat(langCode, {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: langCode.startsWith("en"),
			timeZone: "UTC",
		}).format(newDate);
	};
	return { prettyDateTime };
};
