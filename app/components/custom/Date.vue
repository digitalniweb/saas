<template>
	<v-chip
		v-if="props.date"
		:variant="props.variant"
		:color="props.color"
		class="mr-2"
	>
		<v-icon v-if="props.icon" :icon="props.icon" class="mr-2"></v-icon>
		{{ prettyDateTime(props.date) }}
		<v-tooltip v-if="props.title" activator="parent" location="top">
			{{ translate(props.title) }}
		</v-tooltip>
	</v-chip>
</template>
<script setup lang="ts">
	import type { dateTitle, dateType } from "~~/digitalniweb-types/date";

	const { prettyDateTime } = useDateTime();

	const { translate } = useTranslations();

	const props = withDefaults(
		defineProps<{
			date: dateType;
			title?: dateTitle;
			icon?: string;
			variant?:
				| "text"
				| "flat"
				| "elevated"
				| "tonal"
				| "outlined"
				| "plain";
			color?: string;
		}>(),
		{
			variant: "elevated",
			color: "grey-darken-5",
		}
	);
</script>
