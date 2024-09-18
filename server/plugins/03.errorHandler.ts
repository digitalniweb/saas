/**
 * Global server error handler if needed for logging for example
 */
export default defineNitroPlugin((nitro) => {
	/* nitro.hooks.hook("error", async (error, { event }) => {
		console.log(`event path: ${event?.path}`); // '/api/website/admin/adminmenu?resourceIds=...'
		console.log("statusCode", event?.node.res.statusCode); // 401
		console.log(`error message: ${error.message}`); // 'Token expired'
		console.log(process.env.APP_NAME, process.env.APP_ID); // globalData appName, appId
	}); */
});
