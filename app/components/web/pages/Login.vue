<template>
	<v-row align="center" justify="center" class="my-5">
		<v-col cols="12" sm="8" md="6" xl="4">
			<CustomLogin />
		</v-col>
	</v-row>
</template>
<script setup lang="ts">
	import { useUserStore } from "@/store/user";
	import { useCurrentPageStore } from "@/store/currentPage";

	const userStore = useUserStore();
	const currentPage = useCurrentPageStore();

	currentPage.page.title =
		currentPage?.module.currentModulePageLanguage?.title ||
		currentPage?.module.currentModulePageLanguage?.name ||
		"";
	currentPage.page.description =
		currentPage?.module.currentModulePageLanguage?.description || "";

	onBeforeMount(async () => {
		if (userStore.user?.role?.RoleType?.name === "admin")
			await navigateTo("/admin");
	});
</script>
