<template>
	<div :style="errorStyle">
		<div
			class="pa-10 bg-white align-self-start ma-5 elevation-9 rounded-lg"
		>
			<p class="text-h1 mb-5">
				{{ error.statusCode }}
			</p>
			<p class="mb-5" v-html="errorMessage"></p>
			<div class="mb-5" v-if="errorStack" v-html="errorStack"></div>
			<p v-if="showRedirectButton">
				<v-btn
					@click="handleError"
					prepend-icon="mdi-home"
					color="#432332"
					class="text-white"
					size="large"
					>Go home</v-btn
				>
			</p>
		</div>
	</div>
</template>
<script setup>
	// This is example how we can invoke this error page from any route (i.e. from page with slug: 'error')
	// const route = useRoute();
	// if (route.params.slug == "error") {
	// 	throw createError({
	// 		statusCode: '404',
	// 		name: "NotFoundError",
	// 		message: "Todo not found",
	// 		statusMessage: "Not Found",
	// 	});
	// }

	const props = defineProps({ error: Object });

	const errorMessage = ref("Oops! Something went wrong 😔");
	const errorStack = ref(false);
	const showRedirectButton = ref(true);

	if (process.env.NODE_ENV === "production") {
		if (props.error.statusCode == "404") {
			errorMessage.value = "Oops! Page not found 😔";
		}
	} else {
		errorMessage.value = props.error.statusMessage || props.error.message;
		errorStack.value = props.error.stack ?? false;
	}

	showRedirectButton.value = props?.error?.data?.showRedirectButton ?? true;

	const errorStyle = useElementStyle({
		"background-image": "url('/img/error.jpg')",
		"background-size": "cover",
		height: "100vh",
	});
	const handleError = () => clearError({ redirect: "/" });

	useServerSeoMeta({
		title: `${props.error.statusCode} - ${errorMessage.value}`,
	});
</script>
