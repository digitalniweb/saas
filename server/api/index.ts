export default eventHandler(async (event) => {
	// console.log(event);

	const config = useRuntimeConfig();
	console.log(config.app);

	return {
		message: "It's working!",
	};
});
