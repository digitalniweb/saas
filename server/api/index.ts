import { randomString } from "../../custom/functions/randomGenerator";
export default eventHandler(async (event) => {
	console.log(randomString());

	return "event";
});
// export default app;
