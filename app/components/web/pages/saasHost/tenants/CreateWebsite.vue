<template>
	<v-row align="center" justify="center" class="my-5">
		<v-col cols="12" sm="8" md="6">
			<v-card class="elevation-12">
				<v-toolbar color="primary" prominent flat height="100">
					<template v-slot:image>
						<v-img
							src="https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
							cover
							class="overlay-dark"
						/>
					</template>
					<v-toolbar-title>
						{{ translate("Create website") }}
					</v-toolbar-title>
				</v-toolbar>
				<v-card-text>
					<v-form ref="form" lazy-validation :disabled="disabled">
						<v-row>
							<v-col cols="12"
								><v-tooltip
									:text="translate('ProvisionalDataInfo')"
								>
									<template v-slot:activator="{ props }">
										<v-btn
											prepend-icon="mdi-run-fast"
											color="primary"
											tile
											variant="outlined"
											v-bind="props"
										>
											{{ translate("Fast fill in") }}
										</v-btn>
									</template>
								</v-tooltip></v-col
							>
							<v-col cols="12">
								<v-text-field
									variant="underlined"
									id="url"
									:label="translate('Website URL')"
									name="url"
									prepend-inner-icon="mdi-web"
									v-model="websiteData.url"
								/>
							</v-col>
							<v-col cols="12">
								<v-file-input
									variant="underlined"
									clearable
									label="Logo"
									prepend-icon="mdi-image"
								></v-file-input>
							</v-col>
							<v-col cols="12">
								<v-file-input
									variant="underlined"
									clearable
									:label="translate('Main image')"
									prepend-icon="mdi-image"
								></v-file-input>
							</v-col>
							<v-col cols="12">
								<v-select
									variant="underlined"
									:label="translate('Language')"
									:items="languageItems"
									:model-value="selectedLanguage"
									:item-props="true"
									item-value="id"
									item-title="name"
								>
								</v-select>
							</v-col>
							<v-col cols="12">
								<v-text-field
									variant="underlined"
									id="name"
									:label="translate('Website name')"
									name="name"
									prepend-inner-icon="mdi-pencil"
									v-model="websiteInfoData.name"
								/>
							</v-col>
							<v-col cols="12">
								<v-text-field
									variant="underlined"
									id="country"
									:label="translate('Country')"
									name="country"
									prepend-inner-icon="mdi-map-marker"
									v-model="websiteInfoData.country"
								/>
							</v-col>
						</v-row>
					</v-form>
				</v-card-text>
			</v-card>
		</v-col>
	</v-row>
</template>
<script setup lang="ts">
	import { useUserStore } from "@/store/user";
	import { useCurrentPageStore } from "@/store/currentPage";
	import type { CreationAttributes } from "sequelize";
	import type {
		WebInformation,
		WebInformationLanguage,
	} from "~~/digitalniweb-types/models/content";
	import { useLanguagesStore } from "~/store/languages";
	import type { languages } from "~~/digitalniweb-types";
	const languageStore = useLanguagesStore();

	let translations = {
		"Fast fill in": {
			cs: "Rychlé vyplnění",
		},
		ProvisionalDataInfo: {
			en: "Fill in provisional data. You will need to change the data later for real information once you decide to launch the website.",
			cs: "Vyplnit provizorními daty. Informace budete muset změnit jakmile budete chtít spustit webové stránky.",
		},
	};
	import { webInformationTranslations } from "~~/digitalniweb-custom/variables/translations/webInformation";

	const { translate } = useTranslations({
		...webInformationTranslations,
		...translations,
	});

	const { modulesLocale } = useLocales();

	const disabled = ref(false);

	const userStore = useUserStore();
	const currentPage = useCurrentPageStore();

	const websiteData = ref({
		url: "",
		mainLanguageId: 0,
	});

	const languageItems = ref<{ name: string; id: number }[]>([]);

	for (const languageCode in languageStore.appLanguages) {
		languageItems.value.push({
			name: languageStore.appLanguages[languageCode as languages].name,
			id: languageStore.appLanguages[languageCode as languages].id,
		});
	}
	const selectedLanguage = languageItems.value[0];

	const websiteInfoData = ref<CreationAttributes<WebInformation>>({
		WebInformationLanguages: [
			{
				languageId:
					languageStore.appLanguages?.[
						languageStore?.main ?? process.env.DEFAULT_LANGUAGE
					]?.id,
			} as WebInformationLanguage,
		],
		name: "",
		googleTagManagerActive: false,
		websiteId: 0,
		websitesMsId: 0,
		owner: "",
		country: "Česká republika",
		city: "",
		zip: "",
		streetAddress: "",
		houseNumber: "",
		fullAddress: "",
		telephone: "",
		email: "",
	});

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
