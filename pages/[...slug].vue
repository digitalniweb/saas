<template>
	<component :is="currentPage?.$state?.module?.currentComponent" />
</template>
<script setup lang="ts">
	import { useRoute } from "nuxt/app";
	import { useCurrentPageStore } from "../store/currentPage";

	const currentPage = useCurrentPageStore();
	const route = useRoute();

	watch(
		route,
		async () => {
			await currentPage.getData();
		},
		{ deep: true, immediate: true }
	);

	definePageMeta({
		layout: "default",
	});

	useSeoMeta({
		title: () => currentPage.page?.title, // when using reactive value we need to use "computed getter syntax (() => value)""
		description: () => currentPage.page?.description,
	});
</script>
