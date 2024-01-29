<template>
	<component :is="currentComponent" />
</template>
<script setup lang="ts">
	// Here needs to be list of all global components which we want to dynamically use. Then we need to import these components from '#components' and add this to 'components' variable
	type componentNames = "AdminPagesWebInformation" | "AdminPagesTestEditor";

	import {
		AdminPagesWebInformation,
		AdminPagesTestEditor,
	} from "#components";
	import { computed, ref, watch } from "#imports";
	import { useRoute } from "nuxt/app";
	import type { GlobalComponents } from "vue-demi";

	type components = Pick<GlobalComponents, componentNames>;
	const components = {
		AdminPagesWebInformation,
		AdminPagesTestEditor,
	};
	const route = useRoute();
	const componentName = ref<componentNames | "div">("div");
	let currentComponent = computed((): any =>
		componentName.value !== "div" ? components[componentName.value] : "div"
	);
	const loadPage = () => {
		let adminPrefix = "/admin";
		let routes: { [key: string]: componentNames } = {
			[adminPrefix + "/webinformation"]: "AdminPagesWebInformation",
			[adminPrefix + "/testeditor"]: "AdminPagesTestEditor",
		};
		componentName.value = routes[route.path] ?? "div";
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
