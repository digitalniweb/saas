import removeDefaults from "~~/digitalniweb-custom/functions/removeDefaults";
import { widgetTextOptionsDefault } from "~~/digitalniweb-custom/variables/widgets";

import { useWidgetsStore } from "~/store/widgets";
import type { modulesWidgetsContent } from "~~/digitalniweb-types/functionality/widgets";
const widgets = useWidgetsStore();

export default (widgetId: number, widget: Partial<modulesWidgetsContent>) => {
	let widgetModelName = widgets.getWidgetById(widgetId)?.model;
	if (widgetModelName && widget?.[widgetModelName]?.options) {
		if (widgetModelName === "WidgetText" && widget[widgetModelName].options)
			return removeDefaults(
				widget[widgetModelName].options,
				widgetTextOptionsDefault
			);
	}
	return undefined;
};
