<template>
	<component :is="currentPage?.$state?.admin?.currentComponent" />
</template>
<script setup lang="ts">
	import { useRoute } from "nuxt/app";
	import { useCurrentPageStore } from "../../store/currentPage";
	import { useUserStore } from "../../store/user";

	const currentPage = useCurrentPageStore();
	const route = useRoute();
	const user = useUserStore();
	const { modulesLocale } = useLocales();

	watch(
		route,
		async () => {
			if (user?.$state.user?.role?.RoleType?.name !== "admin") {
				return await navigateTo(modulesLocale("users", "Login", "url"));
			}
			await currentPage.getAdminData();
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
