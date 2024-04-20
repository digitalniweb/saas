<template></template>
<script setup lang="ts">
	import { ref, watch } from "#imports";
	import { useRoute } from "nuxt/app";

	const route = useRoute();
	const componentName = ref<"div">("div");

	const loadPage = () => {
		componentName.value = "div";
	};
	watch(
		route,
		() => {
			loadPage();
		},
		{ deep: true, immediate: true }
	);
	definePageMeta({
		layout: "admin",
	});
</script>
