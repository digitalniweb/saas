import { log } from "~/digitalniweb-custom/helpers/logger";
import AppModule from "~/server/models/apps/appModule";

export default eventHandler(async (event): Promise<number[] | null | false> => {
	try {
		let modules = await AppModule.findAll();
		let modulesIds: number[] = [];
		modulesIds = modules.map((module) => module.moduleId);

		return modulesIds;
	} catch (error: any) {
		log({
			type: "routing",
			status: "error",
			message: `Couldn't get app's modules ids.`,
			error,
		});
		return false;
	}
});
