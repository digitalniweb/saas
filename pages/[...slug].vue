<template>
	<component :is="currentComponent" />
</template>
<script setup lang="ts">
	import { computed, ref, watch } from "#imports";
	import { useRoute } from "nuxt/app";
	import { useCurrentPageStore } from "../store/currentPage";
	// import type { GlobalComponents } from "vue-demi";
	import { modules } from "../digitalniweb-types/functionality/modules";

	import { WebPagesArticle, WebContentUser } from "#components";
	// ↓ add `| typeof 'GlobalComponent'` from the import above ↑
	type componentsTypes = {
		[K in modules]?: typeof WebPagesArticle | typeof WebContentUser;
	};

	const components = {
		articles: WebPagesArticle,
		users: WebContentUser,
	} as componentsTypes;

	const componentName = ref<modules | "div">("div");

	let currentComponent = computed((): any =>
		componentName.value !== "div" && componentName.value in components
			? components[componentName.value as keyof typeof components]
			: "div"
	);

	const currentPage = useCurrentPageStore();
	const route = useRoute();

	const loadPage = () => {
		componentName.value = currentPage.$state.module.current?.name ?? "div";
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
