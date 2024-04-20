<template>
	<component :is="dynamicComponent" />
</template>
<script setup lang="ts">
	import { ref, watch } from "#imports";
	import { useRoute } from "nuxt/app";
	import { useCurrentPageStore } from "../store/currentPage";

	const currentPage = useCurrentPageStore();
	const route = useRoute();

	const componentName = ref("WebPagesArticle");
	const dynamicComponent = resolveComponent(componentName.value);

	const loadPage = () => {
		componentName.value =
			currentPage.$state.module.currentComponent ?? "div";
	};
	watch(
		route,
		async () => {
			await currentPage.getData();
			loadPage();
		},
		{ deep: true, immediate: true }
	);
	definePageMeta({
		layout: "default",
	});
</script>
