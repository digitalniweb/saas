import AppModule from "~~/server/models/apps/appModule";

export default eventHandler(async (event): Promise<number[] | null | false> => {
	let modules = await AppModule.findAll();
	let modulesIds: number[] = [];
	modulesIds = modules.map((module) => module.moduleId);

	return modulesIds;
});
