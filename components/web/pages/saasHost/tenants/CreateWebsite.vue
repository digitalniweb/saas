<template>
	<v-row align="center" justify="center" class="my-5">
		<v-col cols="12" sm="8" md="6" xl="4">
			<v-card>
				<v-card-text> Create </v-card-text>
			</v-card>
		</v-col>
	</v-row>
</template>
<script setup lang="ts">
	import { useUserStore } from "@/store/user";
	import { useCurrentPageStore } from "@/store/currentPage";

	const { modulesLocale } = useLocales();

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
		else if (userStore.user?.role?.RoleType?.name !== "user")
			await navigateTo(
				modulesLocale(
					"saasHost",
					`Create tenant's website login`,
					"url"
				)
			);
	});
</script>
