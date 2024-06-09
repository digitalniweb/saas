<template>
	<component :is="componentName" />
</template>
<script setup lang="ts">
	import { ref, watch } from "#imports";
	import { useRoute } from "nuxt/app";
	import { useCurrentPageStore } from "../store/currentPage";

	const currentPage = useCurrentPageStore();
	const route = useRoute();

	const componentName = ref("");

	const loadPage = () => {
		componentName.value = currentPage.module.currentComponent ?? "";
	};

	loadPage();

	async function loadCurrentPage() {
		await currentPage.getData();
		loadPage();
	}

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

	useSeoMeta({
		title: () => currentPage.page?.title, // when using reactive value we need to use "computed getter syntax (() => value)""
		description: () => currentPage.page?.description,
	});
</script>
