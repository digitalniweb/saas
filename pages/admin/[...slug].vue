<template>
	<component :is="currentPage?.$state?.module?.currentComponent" />
</template>
<script setup lang="ts">
	import { useRoute } from "nuxt/app";
	import { useCurrentPageStore } from "../../store/currentPage";
	import { useUserStore } from "../../store/user";

	const currentPage = useCurrentPageStore();
	const route = useRoute();
	const user = useUserStore();

	if (user?.$state.user?.role?.RoleType?.name !== "admin") {
		// !!! this doesn't account language - need to be done
		navigateTo("/login");
	}

	watch(
		route,
		async () => {
			await currentPage.getData();
		},
		{ deep: true, immediate: true }
	);
	definePageMeta({
		layout: "admin",
		// middleware: ["auth-admin"],
	});

	useSeoMeta({
		title: () => currentPage.page?.title || "Admin", // when using reactive value we need to use "computed getter syntax (() => value)""
		description: "",
	});
</script>
