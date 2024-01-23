<template>
	<component :is="currentComponent" />
</template>
<script setup lang="ts">
	// Here needs to be list of all global components which we want to dynamically use. Then we need to import these components from '#components' and add this to 'components' variable
	type componentNames = "WebContentUser" | "WebPagesLogin";

	import { WebContentUser, WebPagesLogin } from "#components";
	import { computed, ref, watch } from "#imports";
	import { useRoute } from "nuxt/app";
	import type { GlobalComponents } from "vue-demi";

	type components = Pick<GlobalComponents, componentNames>;
	const components = {
		WebContentUser,
		WebPagesLogin,
	};
	const route = useRoute();
	const componentName = ref<componentNames | "div">("div");
	let currentComponent = computed((): any =>
		componentName.value !== "div" ? components[componentName.value] : "div"
	);
	const loadPage = () => {
		if (route.path === "/user") componentName.value = "WebContentUser";
		else if (route.path === "/login") componentName.value = "WebPagesLogin";
		else componentName.value = "div";
	};
	watch(
		route,
		() => {
			loadPage();
		},
		{ deep: true, immediate: true }
	);
	definePageMeta({
		layout: "default",
	});
	/*
	// this doesn't unfortunatelly work
	const route = useRoute();
	const componentName = ref("WebBlocksMenu");
	let currentComponent = computed(() =>
		resolveComponent(componentName.value)
	);
	const loadPage = () => {
		let i = Math.round(Math.random() * 100) % 2;
		console.log(i);

		componentName.value = i == 0 ? "ContentUser" : "WebBlocksMenu";
	};
	watch(
		route,
		() => {
			console.log("test");

			loadPage();
		},
		{ deep: true, immediate: true }
	); */
</script>
