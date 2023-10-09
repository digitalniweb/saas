<template>
	<h1>How to Create a Website with Digitalweb.com in Minutes</h1>
	<p>
		Digitalweb.com is the best place to create your own website. Whether you
		need a personal blog, a business site, or an online store, Digitalweb
		has everything you need. You can choose from hundreds of templates or
		start from scratch. You can drag and drop elements, add images, videos,
		text, and more. You can customize your design and make it your own. You
		don't need any coding skills to create a stunning website with
		Digitalweb.com.
	</p>
	<p>
		Creating a website with Digitalweb is easy and fun. Just follow these
		simple steps:
	</p>
	<ol>
		<li>Sign up for a free account.</li>
		<li>Pick a template or start from scratch.</li>
		<li>Edit your site with the Digitalweb Editor.</li>
		<li>Publish your site and share it with the world.</li>
	</ol>
	<p>
		Ready to get started? Click the button below and create your own website
		with Digitalweb.com today.
	</p>
	<p>
		<v-btn color="primary">Create Your Website</v-btn>
	</p>
	<component :is="currentComponent" />
</template>
<script setup lang="ts">
	// Here needs to be list of all global components which we want to dynamically use. Then we need to import these components from '#components' and add this to 'components' variable
	type componentNames = "ContentUser";

	import { ContentUser } from "#components";
	import { GlobalComponents } from "nuxt/dist/app/compat/vue-demi";

	type components = Pick<GlobalComponents, componentNames>;
	const components = {
		ContentUser,
	};
	const route = useRoute();
	const componentName = ref<componentNames | "div">("div");
	let currentComponent = computed((): any =>
		componentName.value !== "div" ? components[componentName.value] : "div"
	);
	const loadPage = () => {
		if (route.path === "/user") componentName.value = "ContentUser";
		else componentName.value = "div";
	};
	watch(
		route,
		() => {
			loadPage();
		},
		{ deep: true, immediate: true }
	);
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
