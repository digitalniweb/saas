import AppLanguage from "../../models/apps/appLanguage";
export default eventHandler(async (event) => {
	try {
		let languages = await AppLanguage.findAll();

		return languages;
	} catch (error) {
		return error;
	}
});
