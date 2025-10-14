<template>
	<v-btn-toggle v-model="size" mandatory>
		<v-tooltip location="top" v-for="value in values">
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
		none: {
			cs: "žádný",
		},
		"extra small": {
			cs: "extra malý",
		},
		small: {
			cs: "malý",
		},
		medium: {
			cs: "střední",
		},
		large: {
			cs: "velký",
		},
		"extra large": {
			cs: "extra velký",
		},
	};
	const { translate } = useTranslations(translations);
	import type { sizeOptions } from "~~/digitalniweb-types/css";
	const props = defineProps<{
		values: sizeOptions[];
	}>();
	const size = defineModel<sizeOptions>({
		default: "none",
	});

	type buttonsValuesType = {
		[key in sizeOptions]: {
			icon: string;
			size: string;
			tooltip: string;
		};
	};
	let buttonsValues: buttonsValuesType = {
		none: {
			icon: "mdi-border-none-variant",
			size: "x-small",
			tooltip: "none",
		},
		"x-small": {
			icon: "mdi-checkbox-blank-outline",
			size: "x-small",
			tooltip: "extra small",
		},
		small: {
			icon: "mdi-checkbox-blank-outline",
			size: "small",
			tooltip: "small",
		},
		medium: {
			icon: "mdi-checkbox-blank-outline",
			size: "medium",
			tooltip: "medium",
		},
		large: {
			icon: "mdi-checkbox-blank-outline",
			size: "large",
			tooltip: "large",
		},
		"x-large": {
			icon: "mdi-checkbox-blank-outline",
			size: "x-large",
			tooltip: "extra large",
		},
	};
</script>
