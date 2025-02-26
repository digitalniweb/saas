<template>
	<v-row align="center" justify="center" class="my-5">
		<v-col cols="12" sm="8" md="8" xl="8">
			<v-tabs v-model="tab" stacked align-tabs="center">
				<v-tab value="one">
					<v-icon>mdi-account-clock</v-icon>
					Rychlá registrace
				</v-tab>
				<v-tab value="two">
					<v-icon>mdi-account-plus</v-icon>
					Úplná registrace
				</v-tab>
				<v-tab value="three">
					<v-icon>mdi-account-arrow-left</v-icon>
					Přihlásit se
				</v-tab>
			</v-tabs>

			<div>
				<v-tabs-window v-model="tab">
					<v-tabs-window-item value="one">
						<WebContentUser
							:headline="'Rychlá registrace'"
							type="register"
							user-type="user"
						/>
					</v-tabs-window-item>

					<v-tabs-window-item value="two">
						<WebContentUser
							:headline="'Úplná registrace'"
							type="register"
							user-type="tenant"
						/>
					</v-tabs-window-item>

					<v-tabs-window-item value="three">
						<CustomLogin />
					</v-tabs-window-item>
				</v-tabs-window>
			</div>
		</v-col>
	</v-row>
</template>
<script setup lang="ts">
	import { useCurrentPageStore } from "@/store/currentPage";

	const currentPage = useCurrentPageStore();

	currentPage.page.title =
		currentPage?.module.currentModulePageLanguage?.title ||
		currentPage?.module.currentModulePageLanguage?.name ||
		"";
	currentPage.page.description =
		currentPage?.module.currentModulePageLanguage?.description || "";

	const tab = ref("one");
</script>
