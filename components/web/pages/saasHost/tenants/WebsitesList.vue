<template>
	<h1>{{ translate("List of your websites") }}</h1>
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
			/>
			<v-select
				:label="translate('Items per page')"
				:items="[10, 25, 50]"
				v-model="dataPaginationOptions.itemsPerPage"
				variant="underlined"
				width="180px"
			></v-select>
		</template>
		<template v-slot:default="{ items }">
			<template v-for="(item, i) in items" :key="i">
				<v-card :color="'indigo'" :variant="'elevated'" class="mx-auto">
					<v-card-item>
						<div>
							<div class="text-overline mb-1">https</div>
							<div class="text-h6 mb-1">Headline</div>
							<div class="text-caption">
								Greyhound divisely hello coldly fonwderfully
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
			<div class="d-flex align-center justify-center pa-4">
				<v-pagination
					v-model="page"
					@update:modelValue="pageUpdated()"
					density="comfortable"
					variant="plain"
					rounded
					show-first-last-page
					start="1"
					:total-visible="paginationOptions.totalVisible"
					:length="paginationOptions.length"
				/>
			</div>
		</template>
	</v-data-iterator>
</template>
<script setup lang="ts">
	import { InferAttributes } from "sequelize";
	import { Website } from "../../../../../digitalniweb-types/models/websites";

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
	import { useSnackBarsStore } from "~/store/snackBars";
	const snackBars = useSnackBarsStore();
	type paginatedList<T> = Promise<{
		count: number;
		rows: T[];
	}>;

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
	};
</script>
