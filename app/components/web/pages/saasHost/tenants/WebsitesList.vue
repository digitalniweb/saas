<template>
	<v-row align="center" justify="center" class="my-5">
		<v-col cols="12" sm="8" md="8" xl="8">
			<v-card class="elevation-12">
				<v-toolbar color="primary" prominent flat height="100">
					<template v-slot:image>
						<v-img
							src="/img/website.webp"
							cover
							class="overlay-dark"
						/>
					</template>
					<v-toolbar-title>
						{{ translate("List of your websites") }}
					</v-toolbar-title>
					<v-fab
						icon="mdi-plus"
						color="green"
						absolute
						:offset="true"
						location="bottom start"
						class="ml-5"
						v-tooltip:bottom-left="translate('Add')"
						:to="
							modulesLocale(
								'saasHost',
								'Create tenant\'s website',
								'url'
							)
						"
						:disabled="newWebsiteActive"
					/>
				</v-toolbar>
				<v-card-text>
					<v-data-iterator
						:items="items"
						:loading="loadingData"
						:items-per-page="dataPaginationOptions.itemsPerPage"
					>
						<template v-slot:header>
							<v-text-field
								v-model="search"
								clearable
								label="Search"
								prepend-icon="mdi-magnify"
								variant="underlined"
								width="300px"
								max-width="100%"
								class="mr-2 float-left"
								@update:model-value="pageUpdated()"
								v-show="showPagination"
							/>
							<v-select
								:label="translate('Items per page')"
								:items="[10, 25, 50]"
								v-model="dataPaginationOptions.itemsPerPage"
								variant="underlined"
								width="180px"
								v-show="showPagination"
							></v-select>
						</template>
						<template v-slot:no-data>
							<p class="mt-10">
								You have no websites yet.<br />
								Start by clicking
								<v-fab
									icon="mdi-plus"
									color="green"
									density="compact"
									size="small"
									v-tooltip:bottom="translate('Add')"
									:to="
										modulesLocale(
											'saasHost',
											'Create tenant\'s website',
											'url'
										)
									"
									:disabled="newWebsiteActive"
								/>
								button to add your first website.
							</p>
						</template>
						<template v-slot:default="{ items }">
							<template v-for="(item, i) in items" :key="i">
								<v-card
									:color="'indigo'"
									:variant="'elevated'"
									class="mx-auto"
								>
									<v-card-item>
										<div>
											<div class="text-overline mb-1">
												https
											</div>
											<div class="text-h6 mb-1">
												Headline
											</div>
											<div class="text-caption">
												Greyhound divisely hello coldly
												fonwderfully
											</div>
										</div>
									</v-card-item>

									<v-card-actions>
										<v-btn> Button </v-btn>
									</v-card-actions>
								</v-card>
							</template>
						</template>

						<template v-slot:footer>
							<div
								class="d-flex align-center justify-center pa-4"
							>
								<v-pagination
									v-model="page"
									@update:modelValue="pageUpdated()"
									density="comfortable"
									variant="plain"
									rounded
									show-first-last-page
									start="1"
									:total-visible="
										paginationOptions.totalVisible
									"
									:length="paginationOptions.length"
									v-show="showPagination"
								/>
							</div>
						</template>
					</v-data-iterator>
				</v-card-text>
			</v-card>
		</v-col>
	</v-row>
</template>
<script setup lang="ts">
	import type { InferAttributes } from "sequelize";
	import type { Website } from "~/../digitalniweb-types/models/websites";

	const { modulesLocale } = useLocales();

	import { useCurrentPageStore } from "@/store/currentPage";
	import { useSnackBarsStore } from "~/store/snackBars";
	const currentPage = useCurrentPageStore();

	currentPage.page.title =
		currentPage?.module.currentModulePageLanguage?.title ||
		currentPage?.module.currentModulePageLanguage?.name ||
		"";
	currentPage.page.description =
		currentPage?.module.currentModulePageLanguage?.description || "";

	const search = ref("");
	const paginationOptions = ref({
		totalVisible: 1,
		length: 1,
	});
	const { debounce } = useDebounce();
	watch(search, (newSearch) => {
		debounce(() => {
			// fetch newSearch
		}, 1000)();
	});

	type dataPaginationOptions<T> = {
		sortBy?: keyof T;
		sortDirection?: "DESC" | "ASC";
		page?: number;
		itemsPerPage?: number;
		search?: string;
	};
	const dataPaginationOptions = ref<
		dataPaginationOptions<InferAttributes<Website>>
	>({});
	const loadingData = ref(false);
	const page = ref(1);
	const items = ref<InferAttributes<Website>[]>([]);
	onMounted(async () => {
		dataPaginationOptions.value.page = 1;
		dataPaginationOptions.value.search = "";
		dataPaginationOptions.value.sortBy = undefined;
		dataPaginationOptions.value.sortDirection = "ASC";
		dataPaginationOptions.value.itemsPerPage = 10;

		// let loadFrom =
		// 	(dataPaginationOptions.value.page - 1) *
		// 	dataPaginationOptions.value.itemsPerPage;
		// let loadTo = loadFrom + (dataPaginationOptions.value.itemsPerPage ?? 0);

		// items.value = allItems.slice(loadFrom, loadTo);
		// paginationOptions.value.length = Math.ceil(
		// 	allItems.length / dataPaginationOptions.value.itemsPerPage
		// );
		// paginationOptions.value.totalVisible =
		// 	paginationOptions.value.length <= 5
		// 		? paginationOptions.value.length
		// 		: 5;
		await getData();
	});
	const pageUpdated = async () => {
		await getData();
	};
	const { fetchData } = useApiCall();
	const snackBars = useSnackBarsStore();
	type paginatedList<T> = Promise<{
		count: number;
		rows: T[];
	}>;

	const showPagination = ref(true);
	const newWebsiteActive = ref(false);

	const translations = {
		"List of your websites": {
			cs: "Seznam webových stránek",
		},
	};
	const { translate } = useTranslations(translations);

	const getData = async () => {
		const queryArray = [];
		for (const [key, value] of Object.entries(dataPaginationOptions.value))
			if (value) queryArray.push(`${key}=${value}`);

		let query = queryArray.join("&");
		if (query !== "") query = "?" + query;

		try {
			const data = await fetchData<
				paginatedList<InferAttributes<Website>> | false
			>(`/api/website/saas-host/tenants/websites${query}`);
			if (data === false) {
				snackBars.setSnackBar({
					color: "error",
					text: translate("ErrorLoadingData"),
				});
				items.value = [];
				page.value = 1;
				return;
			}
			paginationOptions.value.length = data?.count ?? 0;
			items.value = data?.rows ?? [];

			showPagination.value = items.value.length > 10;
		} catch (error: any) {
			// console.log(error.data);
		}
	};
</script>
