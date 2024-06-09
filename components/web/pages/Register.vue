<template>Register</template>
<script setup lang="ts">
	import { useCurrentPageStore } from "@/store/currentPage";

	const currentPage = useCurrentPageStore();

	currentPage.page.title =
		currentPage?.module.currentModulePageLanguage?.title ||
		currentPage?.module.currentModulePageLanguage?.name ||
		"";
	currentPage.page.description =
		currentPage?.module.currentModulePageLanguage?.description || "";
</script>
