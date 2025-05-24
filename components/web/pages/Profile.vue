<template>
	<v-row align="center" justify="center" class="my-5">
		<v-col cols="12" sm="8" md="8">
			<client-only>
				<WebContentUser
					:headline="'Profil'"
					type="edit"
					:userType="userType"
				/>
			</client-only>
		</v-col>
	</v-row>
</template>
<script setup lang="ts">
	import { useUserStore } from "@/store/user";
	import { useCurrentPageStore } from "@/store/currentPage";
	const { modulesLocale } = useLocales();

	const userStore = useUserStore();
	const currentPage = useCurrentPageStore();

	const userType = userStore.user?.role.name === "tenant" ? "tenant" : "user";

	currentPage.page.title =
		currentPage?.module.currentModulePageLanguage?.title ||
		currentPage?.module.currentModulePageLanguage?.name ||
		"";
	currentPage.page.description =
		currentPage?.module.currentModulePageLanguage?.description || "";

	onBeforeMount(async () => {
		if (!userStore.user)
			await navigateTo(modulesLocale("users", "Login", "url"));
	});
</script>
