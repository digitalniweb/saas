/**
 * Global server error handler if needed for logging for example
 * I can suppress the "unhandeled" error with "error.unhandled = false;" but it is undocumented therefore unstable - should use "throw createError(error)" instead to throw errors
 */
export default defineNitroPlugin((nitro) => {
	nitro.hooks.hook("error", async (error: any, { event }) => {
		// if (error.data) {
		// 	// error.unhandled = false;
		// 	if (event?.node.res.statusCode) event.node.res.statusCode = 500;
		// }
		// console.log((error as any)?.data); // this exists
		/* console.log(`event path: ${event?.path}`); // '/api/website/admin/adminmenu?resourceIds=...'
		console.log("statusCode", event?.node.res.statusCode); // 401
		console.log(`error message: ${error.message}`); // 'Token expired'
		console.log(process.env.APP_NAME, process.env.APP_ID); // globalData appName, appId */
	});
});
