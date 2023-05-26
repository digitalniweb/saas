<template>
	<v-footer :style="footerStyle">
		{{ footerStyle }}
		<v-row>
			<v-col>&copy; {{ new Date().getFullYear() }}</v-col>
		</v-row>
	</v-footer>
</template>
<script setup>
	// load menu from /api/website/footer.get

	const { data: footer } = await useFetch("/api/website/footer");

	const footerStyle = computed(() =>
		elementStyle(footer.value.appereance.style)
	);
</script>
