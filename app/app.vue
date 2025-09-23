<template>
	<NuxtLoadingIndicator :throttle="200" />
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
	<div class="pageLoader">
		<v-progress-circular
			color="primary"
			indeterminate
			size="50"
		></v-progress-circular>
	</div>
	<CustomConfirm />
	<CustomSnackBars />
	<CustomFileManager />
</template>
<script setup lang="ts">
	import { useCurrentPageStore } from "./store/currentPage";

	const currentPage = useCurrentPageStore();
	useHead({
		bodyAttrs: {
			class: () => (currentPage.disabled ? "disabled" : ""),
		},
	});
</script>
