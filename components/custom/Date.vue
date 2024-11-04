<template>
	<v-chip
		v-if="props.date"
		:variant="props.variant"
		:color="props.color"
		class="mr-2"
	>
		<v-icon v-if="props.icon" :icon="props.icon" class="mr-2"></v-icon>
		{{ formatDate(props.date) }}
		<v-tooltip v-if="props.title" activator="parent" location="top">
			{{ translate(props.title) }}
		</v-tooltip>
	</v-chip>
</template>
<script setup lang="ts">
	import { useCurrentPageStore } from "~/store/currentPage";
	const currentPage = useCurrentPageStore();
	type date = Date | string | undefined | null;
	type dateTitle = "Created" | "Updated" | "Deleted" | undefined;

	const { translate } = useTranslations();

	const props = withDefaults(
		defineProps<{
			date: date;
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

	const formatDate = (date: date): string => {
		if (!date) return "";
		let langCode = currentPage.language?.code || "en";
		return new Intl.DateTimeFormat(langCode, {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: langCode.startsWith("en"),
			timeZone: "UTC",
		}).format(new Date(date));
	};
</script>
