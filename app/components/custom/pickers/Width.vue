<template>
	<v-btn-toggle v-model="width" mandatory>
		<v-tooltip location="top" v-for="value in props.values">
			<template v-slot:activator="{ props }">
				<v-btn
					:key="value"
					:value="value"
					:icon="buttonsValues[value].icon"
					:size="buttonsValues[value].size"
					v-bind="props"
				/>
			</template>
			{{ translate(buttonsValues[value].tooltip) }}
		</v-tooltip>
	</v-btn-toggle>
</template>

<script setup lang="ts">
	let translations = {
		wide: {
			cs: "široký",
		},
		narrow: {
			cs: "úzký",
		},
	};
	const { translate } = useTranslations(translations);
	import type { widthOptions } from "~~/digitalniweb-types/css";
	const props = defineProps<{
		values: widthOptions[];
	}>();
	const width = defineModel<widthOptions>({
		default: "container-fluid",
	});
	type buttonsValuesType = {
		[key in widthOptions]: {
			icon: string;
			size: string;
			tooltip: string;
		};
	};
	let buttonsValues: buttonsValuesType = {
		"container-fluid": {
			icon: "mdi-arrow-left-right",
			size: "default",
			tooltip: "wide",
		},
		container: {
			icon: "mdi-arrow-expand-horizontal",
			size: "default",
			tooltip: "narrow",
		},
		"w-100": {
			icon: "mdi-arrow-left-right",
			size: "default",
			tooltip: "100 %",
		},
		"w-3/4": {
			icon: "mdi-arrow-left-right",
			size: "default",
			tooltip: "75 %",
		},
		"w-2/3": {
			icon: "mdi-arrow-left-right",
			size: "default",
			tooltip: "66 %",
		},
		"w-1/2": {
			icon: "mdi-arrow-left-right",
			size: "default",
			tooltip: "50 %",
		},
		"w-1/3": {
			icon: "mdi-arrow-left-right",
			size: "default",
			tooltip: "33 %",
		},
		"w-1/4": {
			icon: "mdi-arrow-left-right",
			size: "default",
			tooltip: "25 %",
		},
		"w-1/6": {
			icon: "mdi-arrow-left-right",
			size: "default",
			tooltip: "16 %",
		},
	};
</script>
