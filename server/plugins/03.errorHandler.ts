/**
 * Global server error handler if needed for logging for example. Not suppressor of the error!
 */
export default defineNitroPlugin((nitro) => {
	// nitro.hooks.hook("error", async (error: any, { event }) => {
	// if (error.data) {
	// 	if (event?.node.res.statusCode) event.node.res.statusCode = 500;
	// }
	// console.log((error as any)?.data); // this exists
	/* console.log(`event path: ${event?.path}`); // '/api/website/admin/adminmenu?resourceIds=...'
		console.log("statusCode", event?.node.res.statusCode); // 401
		console.log(`error message: ${error.message}`); // 'Token expired'
		console.log(process.env.APP_NAME, process.env.APP_ID); // globalData appName, appId */
	// });
});
