import AppLanguage from "../../models/apps/appLanguage";
export default eventHandler(async (event) => {
	try {
		/* console.log(
			"event.context.db.AppLanguage",
			event.context.db.AppLanguage
		);
		return []; */
		let languages = await AppLanguage.findAll();

		return languages;
	} catch (error) {
		return error;
	}
});
