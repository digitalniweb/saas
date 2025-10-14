<template>
	<v-btn color="primary" fab small @click="openChooseMenuIcon">
		<v-icon>mdi-magnify</v-icon>
	</v-btn>
	<CustomConfirmTeleport :teleportId="chooseMenuIconTeleportId">
		<v-text-field
			v-model="filterText"
			:label="translate('Find')"
			counter="64"
		/>
		<v-container>
			<v-row class="justify-center">
				<v-col
					cols="12"
					sm="5"
					md="4"
					lg="3"
					xl="2"
					class="text-center"
					v-if="path"
				>
					<v-card
						color="white"
						class="pa-1 d-flex align-center justify-center h-100 flex-column"
					>
						<v-icon :icon="'mdi-' + path"></v-icon>
						<v-card-text class="text-subtitle-2">{{
							path
						}}</v-card-text>
					</v-card>
				</v-col>
				<v-col
					cols="1"
					class="d-flex align-center justify-center"
					v-if="path && newlySelectedIcon"
				>
					<v-icon icon="mdi-arrow-right"></v-icon>
				</v-col>
				<v-col
					cols="12"
					sm="5"
					md="4"
					lg="3"
					xl="2"
					class="text-center"
					v-if="newlySelectedIcon"
				>
					<v-card
						color="amber"
						class="pa-1 d-flex align-center justify-center h-100 flex-column"
					>
						<v-icon :icon="'mdi-' + newlySelectedIcon"></v-icon>
						<v-card-text class="text-subtitle-2">{{
							newlySelectedIcon
						}}</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
		<v-divider class="my-3"></v-divider>
		<v-infinite-scroll
			@load="loadMoreIcons"
			height="300"
			:empty-text="translations.empty.cs"
		>
			<v-container>
				<v-row>
					<v-col
						v-for="(icon, index) in displayedIcons"
						:key="index"
						cols="12"
						sm="6"
						md="4"
						lg="3"
						xl="2"
						class="text-center"
					>
						<v-card
							@click="selectIcon(icon.name)"
							class="pa-3 d-flex align-center justify-center h-100 flex-column"
							hover
						>
							<v-icon
								:icon="'mdi-' + icon.name"
								style="font-size: 30px"
							></v-icon>
							<v-card-text>
								{{ icon.name }}
							</v-card-text>
						</v-card>
					</v-col>
				</v-row>
			</v-container>
		</v-infinite-scroll>
	</CustomConfirmTeleport>
</template>
<script setup lang="ts">
	import { useConfirmStore } from "~/store/confirm";
	const { fetchData } = useApiCall();
	const confirmStore = useConfirmStore();

	let translations = {
		empty: {
			en: "No more items",
			cs: "To je vše",
		},
		"Choose Icon": {
			cs: "Vyberte ikonku",
		},
	};
	const { translate } = useTranslations(translations);

	const chooseMenuIconTeleportId = ref("chooseMenuIconTeleportId");

	const filterText = ref("");

	type icons = { name: string; aliases: string[]; tags: string[] }[];
	let icons = ref<undefined | icons>(undefined);

	const displayedIcons = ref<icons>([]);

	// Settings for lazy loading
	const infiniteLoadingChunkSize = 50;

	let infiniteLoadingDoneCb = undefined as any;

	// Method to load more icons
	function loadMoreIcons({ done }: any) {
		infiniteLoadingDoneCb = done;

		if (displayedIcons.value.length >= (filteredIcons.value?.length || 0)) {
			done("empty");
			return;
		}

		newChunkIcons(infiniteLoadingChunkSize);
	}

	function newChunkIcons(infiniteLoadingChunkSize: number) {
		const nextIcons = filteredIcons.value?.slice(
			displayedIcons.value.length,
			displayedIcons.value.length + infiniteLoadingChunkSize
		);

		if (nextIcons) displayedIcons.value.push(...nextIcons);
		infiniteLoadingDoneCb("ok");
	}

	const newlySelectedIcon = ref("");
	const filteredIcons = ref<icons>([]);
	const { debounce } = useDebounce();
	watch(filterText, (newFilterText) => {
		debounce(() => {
			displayedIcons.value = [];
			if (!newFilterText && icons.value) {
				filteredIcons.value = [...icons.value];
			} else {
				filteredIcons.value =
					icons.value?.filter((icon) =>
						icon.name
							.toLowerCase()
							.includes(newFilterText?.toLowerCase())
					) ?? [];
			}
			newChunkIcons(infiniteLoadingChunkSize);
		}, 1000)();
	});

	const selectIcon = (icon: string) => {
		newlySelectedIcon.value = icon;
	};

	const path = defineModel<string | null>({
		default: "",
	});

	const openChooseMenuIcon = async () => {
		if (icons.value === undefined)
			// this is temporary, this should get downloaded from https://raw.githubusercontent.com/fgnass/mdi-json/refs/heads/master/icons.json and implemented some kind of cash (with stripping unused properties)
			icons.value = await fetchData<[]>(
				"http://digitalniwebapp.local:3000/icons/mdi-icons.json"
			);

		if (icons.value) filteredIcons.value = [...icons.value];

		filterText.value = "";

		let response = await confirmStore.open(
			translate("Choose Icon"),
			"",
			{
				width: 1000,
				type: "okCancel",
			},
			chooseMenuIconTeleportId.value
		);

		filteredIcons.value = [];
		displayedIcons.value = [];
		if (!response) {
			newlySelectedIcon.value = "";
			return;
		}
		path.value = newlySelectedIcon.value;
		newlySelectedIcon.value = "";
	};
</script>
