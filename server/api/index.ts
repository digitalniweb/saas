import appCache from "~/digitalniweb-custom/helpers/appCache";
import { randomString } from "../../digitalniweb-custom/functions/randomGenerator";

export default eventHandler(async (event) => {
	// console.log(event);
	//console.log(randomString());

	// const config = useRuntimeConfig();
	// console.log(config.apiSecret);
	console.log(appCache.get("serviceRegistry"));

	return {
		message: "It's working!",
	};
});
