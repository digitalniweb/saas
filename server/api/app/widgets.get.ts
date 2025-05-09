import AppWidget from "~/server/models/apps/appWidget";

export default eventHandler(async (event): Promise<number[] | null | false> => {
	let widgets = await AppWidget.findAll();
	let widgetsIds: number[] = [];
	widgetsIds = widgets.map((widget) => widget.widgetId);

	return widgetsIds;
});
