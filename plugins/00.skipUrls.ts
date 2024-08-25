export default defineNuxtPlugin((nuxtApp) => {
	// * In app I can get this with:
	// const nuxtApp = useNuxtApp(); // this line is needed inside app where "nuxtApp" isn't exposed
	// nuxtApp.$skipUrl; // this line is sufficient inside other plugins
	// ! this looks like it has no effect anymore and is redundant
	// ! if I ever remove this remove all occurances of 'skipUrl'
	// let currentUrl = useRequestURL(); // returns only current URL, not images etc.
	// const skipURLsStarting = ["css", "images", "img", "files"];
	// const skipUrl = skipURLsStarting.some((url) => {
	// 	let regex = new RegExp("^/" + url);
	// 	return regex.test(currentUrl.pathname);
	// });
	// return {
	// 	provide: {
	// 		skipUrl,
	// 	},
	// };
});
