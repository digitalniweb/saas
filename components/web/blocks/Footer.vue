<template>
	<v-footer :style="footerStyle">
		{{ footerStyle }}
		<v-row>
			<v-col>&copy; {{ new Date().getFullYear() }}</v-col>
		</v-row>
	</v-footer>
</template>
<script setup>
	const { data: footer } = useFetch("/api/website/footer");

	const footerStyle = computed(() =>
		useElementStyle(footer.value.appereance.style)
	);
</script>
