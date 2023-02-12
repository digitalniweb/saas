import { randomString } from "../../digitalniweb-custom/functions/randomGenerator";
export default eventHandler(async (event) => {
	// console.log(event);
	const config = useRuntimeConfig();
	console.log(config);

	return {
		secret: config.apiSecret,
	};
	//console.log(randomString());
});
// export default app;
