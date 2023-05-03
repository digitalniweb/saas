<template>
	<v-footer :style="footerStyle">
		{{ footerStyle }}
		<v-row>
			<v-col>&copy; {{ new Date().getFullYear() }}</v-col>
		</v-row>
	</v-footer>
</template>
<script setup>
	// load menu from /api/menu

	const { data: footer } = useFetch("/api/footer");

	const footerStyle = computed(() =>
		elementStyle(footer.value.appereance.style)
	);
</script>
