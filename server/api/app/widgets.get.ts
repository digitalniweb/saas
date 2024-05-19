import { log } from "~/digitalniweb-custom/helpers/logger";
import AppWidget from "~/server/models/apps/appWidget";

export default eventHandler(async (event): Promise<number[] | null | false> => {
	try {
		let widgets = await AppWidget.findAll();
		let widgetsIds: number[] = [];
		widgetsIds = widgets.map((widget) => widget.widgetId);

		return widgetsIds;
	} catch (error: any) {
		log({
			type: "routing",
			status: "error",
			message: `Couldn't get app's widgets ids.`,
			error,
		});
		return false;
	}
});
