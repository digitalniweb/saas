<template>
	<component :is="dynamicComponent" />
</template>
<script setup lang="ts">
	import { ref, watch } from "#imports";
	import { useRoute } from "nuxt/app";
	import { useCurrentPageStore } from "../store/currentPage";

	const currentPage = useCurrentPageStore();
	const route = useRoute();

	const componentName = ref("");
	const dynamicComponent = computed(() =>
		resolveComponent(componentName.value)
	);

	const loadPage = () => {
		componentName.value = currentPage.$state.module.currentComponent ?? "";
	};
	async function loadCurrentPage() {
		await currentPage.getData();
		loadPage();
	}
	await loadCurrentPage();
	watch(
		route,
		async () => {
			await loadCurrentPage();
		},
		{ deep: true, immediate: true }
	);
	definePageMeta({
		layout: "default",
	});
</script>
