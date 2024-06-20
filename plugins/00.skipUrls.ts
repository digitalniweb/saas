export default defineNuxtPlugin(() => {
	// * In app I can get this with:
	// const nuxtApp = useNuxtApp(); // this line is needed inside app where "nuxtApp" isn't exposed
	// nuxtApp.$skipUrl; // this line is sufficient inside other plugins

	let currentUrl = useRequestURL();
	const skipURLsStarting = ["css", "images", "img", "files"];
	const skipUrl = skipURLsStarting.some((url) => {
		let regex = new RegExp("^/" + url);
		return regex.test(currentUrl.pathname);
	});
	return {
		provide: {
			skipUrl,
		},
	};
});
