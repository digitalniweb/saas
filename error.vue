<template>
	<div :style="errorStyle">
		<div
			class="pa-10 bg-white align-self-start ma-5 elevation-9 rounded-lg"
		>
			<p class="text-h1">
				{{ error.statusCode }}
			</p>
			<p class="mb-5">
				{{ error.message }}
			</p>
			<p>
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
	/*
	// This is example how we can invoke this error page from any route (i.e. from page with slug: 'error')
	const route = useRoute();
	if (route.params.slug == "error") {
		throw createError({
			statusCode: 404,
			name: "NotFoundError",
			message: "Todo not found",
			statusMessage: "Not Found",
		});
	}
	 */
	const props = defineProps({ error: Object });

	if (props.error.statusCode === 404 || "404") {
		props.error.message = "Oops! Page not found 😔";
	} else {
		props.error.message = "Oops! Something went wrong 😔";
	}

	const errorStyle = elementStyle({
		"background-image": "url('/img/error.jpg')",
		"background-size": "cover",
		height: "100vh",
	});
	const handleError = () => clearError({ redirect: "/" });

	useServerSeoMeta({
		title: `${props.error.statusCode}${
			props.error.message && ` - ${props.error.message}`
		}`,
	});
</script>
